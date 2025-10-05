import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitProducerService {
  private exchange: string;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange = this.configService.get('RMQ_EXCHANGE') || 'IoT_GreenHouse';
  }

  async publishMessageToOTPEmailQueue(message: any) {
    await this.amqpConnection.publish(this.exchange, 'user.email.otp', message);
  }
}
