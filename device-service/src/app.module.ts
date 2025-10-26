import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomRabbitModule } from './rabbitmq/rabbitmq.module';
import { TypeOrmModule } from './db/typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    CustomRabbitModule,
    TypeOrmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
