import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitConsumerService } from './services/consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: process.env.RMQ_EXCHANGE || 'IoT_GreenHouse',
          type: 'direct',
        },
      ],
      uri: `amqps://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}/${process.env.RMQ_USER}`,
      connectionInitOptions: { wait: false },
      queues: [
        {
          name: 'OTP-email-queue',
          exchange: process.env.RMG_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.otp',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'Sensor-email-queue',
          exchange: process.env.RMG_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.sensor',
          options: {
            noAck: false,
            durable: true,
          },
        },
      ],
    }),
    CustomRabbitModule,
  ],
  providers: [ConfigService, RabbitConsumerService],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
