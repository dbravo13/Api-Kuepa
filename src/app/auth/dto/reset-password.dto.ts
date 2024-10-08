import { IsString, MinLength, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID('4')
  resetPasswordToken!: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password!: string;
}
