import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitConsumerService } from './consumer.service';
import { SensorService } from 'src/services/sensor.service';
import { TypeOrmModule } from 'src/db/typeorm.module';
import { RabbitProducerService } from './producer.service';
import { FarmService } from 'src/services/farm.service';

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
          name: 'raw-sensor-data-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'farm.sensor.raw_data',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'sensor-data-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'farm.sensor.data',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'sensor-notification-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'farm.sensor.notification',
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
      ],
    }),
    CustomRabbitModule,
  ],
  providers: [
    ConfigService,
    SensorService,
    FarmService,
    RabbitConsumerService,
    RabbitProducerService,
  ],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
