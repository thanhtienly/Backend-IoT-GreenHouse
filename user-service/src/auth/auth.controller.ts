import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDTO } from 'src/dto/auth.dto';
import { AuthService } from './services/auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInData: SignInDTO, @Res() res: Response) {
    var response = await this.authService.signIn(signInData);
    res.status(response.status).json({
      message: response?.message,
      isSuccess: response.isSuccess,
      data: response?.data,
    });
  }

  @Post('forgot-password')
  async forgotPassword() {}

  @Post('otp/new-otp')
  async generateNewOtp() {}

  @Post('otp/validate')
  async validateOtp() {}

  @Post('reset-password')
  async resetPassword() {}
}
