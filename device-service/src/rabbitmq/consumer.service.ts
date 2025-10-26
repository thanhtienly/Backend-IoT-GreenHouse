import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  DeviceModeUpdateDTO,
  PendingActionDeviceDTO,
  SensorDataDTO,
} from 'src/dto/queue.dto';
import {
  Device,
  DeviceHistory,
  DeviceMode,
  ThresholdType,
} from 'src/entity/device.entity';
import { DeviceService } from 'src/services/device.service';
import { RabbitProducerService } from './producer.service';
import { AdafruitIoMqttService } from 'src/services/mqtt.service';

dotenv.config({
  path: '.env.local',
});

@Injectable()
export class RabbitConsumerService {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly producerService: RabbitProducerService,
    private readonly mqttService: AdafruitIoMqttService,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'farm.sensor.data',
    queue: 'sensor-data-queue',
  })
  public async handleSensorDataQueue(msg: SensorDataDTO) {
    console.log('Consume sensor data queue');
    console.log(msg);
    var deviceConfigs = await this.deviceService.findDeviceConfigBySensorType(
      msg.sensorType,
    );

    if (deviceConfigs == null) {
      return;
    }

    /* Get all device mode and its id if sensor value triggered threshold */
    var deviceActionModeMap = new Map();
    var thresholdTypeMap = new Map();
    for (let i = 0; i < deviceConfigs.length; i++) {
      let config = deviceConfigs[i];

      /* Is trigger threshold ? */
      if (
        (msg.value >= config.value &&
          config.thresholdType == ThresholdType.MAX) ||
        (msg.value <= config.value && config.thresholdType == ThresholdType.MIN)
      ) {
        var deviceId = config.deviceId;

        if (!deviceActionModeMap.get(deviceId)) {
          deviceActionModeMap.set(deviceId, config.deviceMode);
          thresholdTypeMap.set(deviceId, config.thresholdType);
        }
      }
    }

    if (deviceActionModeMap.size == 0) {
      return;
    }

    /* Get all device need to action, it means current device mode != new device mode */
    var deviceToAction: Device[] = [];
    var deviceIdArr = [...deviceActionModeMap.keys()];
    for (let i = 0; i < deviceIdArr.length; i++) {
      let deviceId = deviceIdArr[i];

      var device = await this.deviceService.findDeviceByIdAndOppositeMode(
        deviceId,
        deviceActionModeMap.get(deviceId),
      );

      if (device != null) {
        deviceToAction.push(device);
      }
    }

    deviceToAction.forEach((device) => {
      this.producerService.publishToPendingActionDeviceQueue({
        ...device,
        newMode: deviceActionModeMap.get(device.id),
      });
      this.producerService.publishToSensorNotificationQueue({
        farmId: msg.farmId,
        sensorType: msg.sensorType,
        value: msg.value,
        deviceId: device.id,
        deviceName: device.name,
        deviceTriggerMode: deviceActionModeMap.get(device.id),
        thresholdType: thresholdTypeMap.get(deviceId),
        isRead: false,
      });
    });
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'device.action.pending',
    queue: 'device-pending-action-queue',
  })
  public async handleDevicePendingActionQueue(msg: PendingActionDeviceDTO) {
    console.log('Consume device pending action queue');
    console.log(msg);
    this.mqttService.publishToDeviceFeed(msg);
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'device.mode.update',
    queue: 'device-mode-update-queue',
  })
  public async handleDeviceModeUpdateQueueMessage(msg: DeviceModeUpdateDTO) {
    console.log('Consume device mode update queue');
    var deviceHistory = new DeviceHistory();

    deviceHistory.deviceId = msg.deviceId;
    deviceHistory.deviceMode = msg.deviceMode;
    deviceHistory.createdAt = msg.createdAt;

    await this.deviceService.createDeviceHistory(deviceHistory);
    await this.deviceService.updateDeviceMode(msg.deviceId, msg.deviceMode);
  }
}
