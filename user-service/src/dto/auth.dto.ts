import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsEmail(
    {},
    {
      message: 'Email should be format of abc@def.xyz',
    },
  )
  @IsNotEmpty({
    message: 'Email field required',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password field required',
  })
  password: string;
}
