import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from './db/typeorm.module';
import { CustomRabbitModule } from './rabbitmq/rabbitmq.module';
import { AdafruitIoMqttService } from './services/mqtt.service';
import { RabbitProducerService } from './rabbitmq/producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    TypeOrmModule,
    CustomRabbitModule,
  ],
  controllers: [],
  providers: [AdafruitIoMqttService, RabbitProducerService],
})
export class AppModule {}
