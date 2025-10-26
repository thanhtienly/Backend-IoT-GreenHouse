import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private mailServiceEndpoint: string;
  constructor(private readonly configService: ConfigService) {
    this.mailServiceEndpoint =
      this.configService.get('MAIL_SERVICE_ENDPOINT') || '';
  }

  async sendMailMessage(receiver: string, subject: string, body: string) {
    try {
      const response = await fetch(this.mailServiceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: receiver,
          subject: subject,
          body: body,
        }),
      });

      if (!response.ok) {
        throw new Error('Something wrong when call mail service API');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
