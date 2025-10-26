import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeviceModeUpdateDTO,
  PendingActionDeviceDTO,
  SensorNotificationDTO,
} from '../dto/queue.dto';

@Injectable()
export class RabbitProducerService {
  private exchange: string;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange = this.configService.get('RMQ_EXCHANGE') || 'IoT_GreenHouse';
  }

  async publishToSensorNotificationQueue(message: SensorNotificationDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'farm.sensor.notification',
      message,
    );
  }

  async publishToPendingActionDeviceQueue(message: PendingActionDeviceDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'device.action.pending',
      message,
    );
  }

  async publishToDeviceModeUpdateQueue(message: DeviceModeUpdateDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'device.mode.update',
      message,
    );
  }
}
