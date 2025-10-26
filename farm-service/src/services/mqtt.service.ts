import * as mqtt from 'mqtt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitProducerService } from 'src/rabbitmq/producer.service';
import { SensorType } from 'src/entity/sensor.entity';
import { ConfigService } from '@nestjs/config';
import { RawSensorDataDTO } from 'src/dto/queue.dto';

@Injectable()
export class AdafruitIoMqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private readonly AIO_USERNAME;
  private readonly AIO_KEY;
  private readonly MQTT_BROKER_URL;
  private readonly MQTT_PORT;

  private readonly TEMPERATURE_FEED_NAME;
  private readonly HUMIDITY_FEED_NAME;
  private readonly LIGHT_FEED_NAME;
  private readonly SOIL_MOISTURE_FEED_NAME;

  constructor(
    private readonly producer: RabbitProducerService,
    private readonly configService: ConfigService,
  ) {
    this.AIO_USERNAME = this.configService.get('AIO_USERNAME');
    this.AIO_KEY = this.configService.get('AIO_KEY');
    this.MQTT_BROKER_URL = this.configService.get('MQTT_BROKER_URL');
    this.MQTT_PORT = this.configService.get('MQTT_PORT');

    this.TEMPERATURE_FEED_NAME = this.configService.get(
      'TEMPERATURE_FEED_NAME',
    );
    this.HUMIDITY_FEED_NAME = this.configService.get('HUMIDITY_FEED_NAME');
    this.LIGHT_FEED_NAME = this.configService.get('LIGHT_FEED_NAME');
    this.SOIL_MOISTURE_FEED_NAME = this.configService.get(
      'SOIL_MOISTURE_FEED_NAME',
    );
  }

  onModuleInit() {
    this.client = mqtt.connect(this.MQTT_BROKER_URL, {
      username: this.AIO_USERNAME,
      password: this.AIO_KEY,
      port: this.MQTT_PORT,
    });

    this.client.on('connect', () => {
      console.log('Connected to Adafruit IO MQTT broker');
      this.subscribeToFeeds();
    });

    this.client.on('message', (topic, message) => {
      var msgStr = message.toString();
      var rawMsgJson: RawSensorDataDTO = this.parseMsg(msgStr);

      this.producer.publishToRawSensorDataQueue(rawMsgJson);
    });

    this.client.on('error', (err) => {
      console.error('MQTT error:', err);
    });
  }

  private parseMsg(msg: string) {
    var message = msg.replace('json:', '');
    try {
      var jsonMsg = JSON.parse(message);
    } catch (error) {
      console.log("Message's format invalid");
    }

    return jsonMsg;
  }

  private subscribeToFeeds() {
    const temperatureFeedTopic = `${this.AIO_USERNAME}/feeds/${this.TEMPERATURE_FEED_NAME}`;
    const humidityFeedTopic = `${this.AIO_USERNAME}/feeds/${this.HUMIDITY_FEED_NAME}`;
    const lightFeedTopic = `${this.AIO_USERNAME}/feeds/${this.LIGHT_FEED_NAME}`;
    const soilMoistureFeedTopic = `${this.AIO_USERNAME}/feeds/${this.SOIL_MOISTURE_FEED_NAME}`;

    this.client.subscribe(temperatureFeedTopic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${temperatureFeedTopic}`);
      } else {
        console.error(`Subscription error for ${temperatureFeedTopic}:`, err);
      }
    });

    this.client.subscribe(humidityFeedTopic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${humidityFeedTopic}`);
      } else {
        console.error(`Subscription error for ${humidityFeedTopic}:`, err);
      }
    });

    this.client.subscribe(lightFeedTopic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${lightFeedTopic}`);
      } else {
        console.error(`Subscription error for ${lightFeedTopic}:`, err);
      }
    });

    this.client.subscribe(soilMoistureFeedTopic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${soilMoistureFeedTopic}`);
      } else {
        console.error(`Subscription error for ${soilMoistureFeedTopic}:`, err);
      }
    });
  }
}
