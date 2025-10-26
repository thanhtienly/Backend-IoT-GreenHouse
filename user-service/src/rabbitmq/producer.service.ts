import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailPendingDTO } from 'src/dto/queue.dto';

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

  async publishMessageToEmailPendingQueue(message: EmailPendingDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'user.email.pending',
      message,
    );
  }
}
