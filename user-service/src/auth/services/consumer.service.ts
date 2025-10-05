import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RabbitConsumerService {
  constructor() {}

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.otp',
    queue: 'OTP-email-queue',
  })
  public async handleOTPEmailQueue(msg: any) {
    console.log('Consume OTP-email-queue message');
    console.log(msg);
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.sensor',
    queue: 'Sensor-email-queue',
  })
  public async handleSensorEmailQueue(msg: any) {
    console.log('Consume Sensor-email-queue message');
    console.log(msg);
  }
}
