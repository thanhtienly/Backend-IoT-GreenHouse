import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  EmailPendingDTO,
  SensorNotificationByEmailDTO,
} from 'src/dto/queue.dto';
import { UserService } from 'src/services/user.service';
import { RabbitProducerService } from './producer.service';
import { MailService } from 'src/services/mail.service';
dotenv.config({
  path: '.env.local',
});

@Injectable()
export class RabbitConsumerService {
  constructor(
    private readonly userService: UserService,
    private readonly producerService: RabbitProducerService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.otp',
    queue: 'otp-email-queue',
  })
  public async handleOTPEmailQueue(msg: any) {
    console.log('Consume OTP-email-queue message');
    console.log(msg);
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.sensor',
    queue: 'sensor-email-queue',
  })
  public async handleSensorEmailQueue(msg: SensorNotificationByEmailDTO) {
    console.log('Consume sensor email queue message');
    console.log(msg);

    var userInfoList = await this.userService.findUserListById(msg.receiver);
    userInfoList.forEach((user) => {
      this.producerService.publishMessageToEmailPendingQueue({
        email: user.email,
        subject: 'Sensor Notification Alert',
        body: `Your green house with id:${msg.farmId} has value of sensor type:${msg.sensorType} in real-time is ${msg.value}, it reaches the threshold. The system will automatically turn device with name:${msg.deviceName} to mode ${msg.deviceTriggerMode}`,
      });
    });
  }

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.pending',
    queue: 'email-pending-queue',
  })
  public async handleEmailPendingQueue(msg: EmailPendingDTO) {
    console.log('Consume email pending queue message');
    console.log(msg);

    try {
      this.mailService.sendMailMessage(msg.email, msg.subject, msg.body);
    } catch (error) {
      return new Nack(true);
    }
  }
}
