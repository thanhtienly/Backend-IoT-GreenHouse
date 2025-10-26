import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RawSensorDataDTO,
  SensorNotificationByEmailDTO,
  SensorNotificationDTO,
} from 'src/dto/queue.dto';
import { SensorData } from 'src/entity/sensor.entity';

@Injectable()
export class RabbitProducerService {
  private exchange: string;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange = this.configService.get('RMQ_EXCHANGE') || 'IoT_GreenHouse';
  }

  async publishToRawSensorDataQueue(message: RawSensorDataDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'farm.sensor.raw_data',
      message,
    );
  }

  async publishToSensorDataQueue(sensorData: SensorData) {
    await this.amqpConnection.publish(
      this.exchange,
      'farm.sensor.data',
      sensorData,
    );
  }

  async publishToSensorEmailQueue(
    sensorNotificationByEmailDTO: SensorNotificationByEmailDTO,
  ) {
    await this.amqpConnection.publish(
      this.exchange,
      'user.email.sensor',
      sensorNotificationByEmailDTO,
    );
  }
}
