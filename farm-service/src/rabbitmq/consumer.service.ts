import { Injectable } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv';
import { SensorData, SensorNotification } from 'src/entity/sensor.entity';
import { RawSensorDataDTO, SensorNotificationDTO } from 'src/dto/queue.dto';
import { SensorService } from 'src/services/sensor.service';
import { RabbitProducerService } from './producer.service';
import { FarmService } from 'src/services/farm.service';

dotenv.config({
  path: '.env.local',
});

@Injectable()
export class RabbitConsumerService {
  constructor(
    private readonly sensorService: SensorService,
    private readonly farmService: FarmService,
    private readonly producerService: RabbitProducerService,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'farm.sensor.raw_data',
    queue: 'raw-sensor-data-queue',
  })
  public async handleRawSensorDataQueue(msg: RawSensorDataDTO) {
    console.log('Consume raw sensor data queue');
    console.log(msg);
    /* Save sensor data to database */
    var sensorData = new SensorData();

    sensorData.farmId = msg.farmId;
    sensorData.value = msg.value;
    sensorData.sensorType = msg.sensorType;
    try {
      sensorData = await this.sensorService.createSensorData(sensorData);

      /* Send sensor data to device service via queue to check if data is in safe range or not */
      this.producerService.publishToSensorDataQueue(sensorData);
    } catch (error) {
      /* Fail to save sensor data, requeue message */
      return new Nack(true);
    }
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'farm.sensor.notification',
    queue: 'sensor-notification-queue',
  })
  public async handleSensorNotificationQueue(msg: SensorNotificationDTO) {
    console.log('Consume sensor notification queue');
    console.log(msg);
    var sensorNotification = new SensorNotification();

    sensorNotification.farmId = msg.farmId;
    sensorNotification.value = msg.value;
    sensorNotification.sensorType = msg.sensorType;
    sensorNotification.thresholdType = msg.thresholdType;
    sensorNotification.deviceId = msg.deviceId;
    sensorNotification.deviceTriggerMode = msg.deviceTriggerMode;
    sensorNotification.isRead = msg.isRead;
    try {
      await this.sensorService.createSensorNotification(sensorNotification);
    } catch (error) {
      console.log(error);
      return new Nack(true);
    }

    var relevantUsers = await this.farmService.getUserWorkOnFarm(msg.farmId);
    if (relevantUsers.length == 0) {
      return;
    }

    var userIdList = relevantUsers.map((workOnItem) => {
      return workOnItem.userId;
    });

    this.producerService.publishToSensorEmailQueue({
      ...msg,
      receiver: userIdList,
    });
  }
}
