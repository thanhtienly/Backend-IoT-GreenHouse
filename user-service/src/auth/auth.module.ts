import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CustomRabbitModule } from './rabbitmq.module';
import { RabbitProducerService } from './services/producer.service';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/services/user.service';
import { TypeOrmModule } from 'src/db/typeorm.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule, CustomRabbitModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
