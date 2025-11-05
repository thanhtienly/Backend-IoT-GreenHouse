import * as mqtt from "mqtt";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitProducerService } from "src/rabbitmq/producer.service";
import { ConfigService } from "@nestjs/config";
import { DeviceModeUpdateDTO, PendingActionDeviceDTO } from "src/dto/queue.dto";
import { DeviceService } from "./device.service";
import { Device } from "src/entity/device.entity";

@Injectable()
export class AdafruitIoMqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private readonly AIO_USERNAME;
  private readonly AIO_KEY;
  private readonly MQTT_BROKER_URL;
  private readonly MQTT_PORT;
  private readonly DEVICE_CONTROL_PREFIX;
  private readonly DEVICE_MODE_UPDATE_PREFIX;

  constructor(
    private readonly producer: RabbitProducerService,
    private readonly configService: ConfigService,
    private readonly deviceService: DeviceService
  ) {
    this.AIO_USERNAME = this.configService.get("AIO_USERNAME");
    this.AIO_KEY = this.configService.get("AIO_KEY");
    this.MQTT_BROKER_URL = this.configService.get("MQTT_BROKER_URL");
    this.MQTT_PORT = this.configService.get("MQTT_PORT");
    this.DEVICE_CONTROL_PREFIX = this.configService.get(
      "DEVICE_CONTROL_PREFIX"
    );
    this.DEVICE_MODE_UPDATE_PREFIX = this.configService.get(
      "DEVICE_MODE_UPDATE_PREFIX"
    );
  }

  async onModuleInit() {
    var devices = await this.deviceService.findAllDevices();
    this.client = mqtt.connect(this.MQTT_BROKER_URL, {
      username: this.AIO_USERNAME,
      password: this.AIO_KEY,
      port: this.MQTT_PORT,
    });

    this.client.on("connect", () => {
      this.subscribeFeeds(devices);
      console.log("Connected to Adafruit IO MQTT broker");
    });

    this.client.on("message", (topic, message) => {
      var msgStr = message.toString();

      /* Don't need to follow up the control message */
      if (msgStr.startsWith(this.DEVICE_CONTROL_PREFIX)) {
        return;
      }

      if (msgStr.startsWith(this.DEVICE_MODE_UPDATE_PREFIX)) {
        this.handleDeviceModeUpdate(msgStr);
      }
    });

    this.client.on("error", (err) => {
      console.error("MQTT error:", err);
    });
  }

  private subscribeFeeds(devices: Device[]) {
    devices.forEach((device) => {
      var topic = `${this.AIO_USERNAME}/feeds/${device.feedName}`;
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
        } else {
          console.error(`Subscription error for ${topic}:`, err);
        }
      });
    });
  }

  publishToDeviceFeed(msg: PendingActionDeviceDTO) {
    var topic = `${this.AIO_USERNAME}/feeds/${msg.feedName}`;
    var deviceControlMessage = {
      deviceId: msg.id,
      deviceName: msg.name,
      deviceType: msg.type,
      newMode: msg.newMode,
    };
    this.client.publish(
      topic,
      `control:${JSON.stringify(deviceControlMessage)}`
    );
  }

  private handleDeviceModeUpdate(msg: string) {
    var message = msg.replace(this.DEVICE_MODE_UPDATE_PREFIX, "");
    console.log(message);
    try {
      var jsonMsg: DeviceModeUpdateDTO = JSON.parse(message);
      this.producer.publishToDeviceModeUpdateQueue(jsonMsg);
    } catch (error) {
      throw error;
    }
  }
}
