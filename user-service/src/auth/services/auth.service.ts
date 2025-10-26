import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ControllerResponse } from 'src/dto/response.dto';
import { SignInDTO } from 'src/dto/auth.dto';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInData: SignInDTO): Promise<ControllerResponse> {
    var user = await this.userService.findByEmail(signInData.email);

    /* User not found */
    if (!user) {
      return {
        status: 404,
        isSuccess: false,
        message: 'User not found',
      };
    }

    var isMatch = await bcrypt.compare(signInData.password, user.password);
    /* Password not match */
    if (!isMatch) {
      return {
        status: 400,
        isSuccess: false,
        message: 'Password not match',
      };
    }

    const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      status: 200,
      isSuccess: true,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
