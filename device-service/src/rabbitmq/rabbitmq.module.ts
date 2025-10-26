import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitConsumerService } from './consumer.service';
import { DeviceService } from 'src/services/device.service';
import { TypeOrmModule } from 'src/db/typeorm.module';
import { RabbitProducerService } from './producer.service';
import { AdafruitIoMqttService } from 'src/services/mqtt.service';

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
          name: 'device-pending-action-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'device.action.pending',
          options: {
            noAck: false,
            durable: true,
          },
        },
        {
          name: 'device-mode-update-queue',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'device.mode.update',
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
    RabbitConsumerService,
    DeviceService,
    RabbitProducerService,
    AdafruitIoMqttService,
  ],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
