import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitConsumerService } from './consumer.service';
import { UserService } from 'src/services/user.service';
import { TypeOrmModule } from 'src/db/typeorm.module';
import { RabbitProducerService } from './producer.service';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule,
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
          name: 'otp-email-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.otp',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'sensor-email-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.sensor',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'email-pending-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.pending',
          options: {
            noAck: false,
            durable: true,
          },
        },
      ],
    }),
    CustomRabbitModule,
  ],
  providers: [
    ConfigService,
    UserService,
    RabbitConsumerService,
    RabbitProducerService,
    MailService,
  ],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
