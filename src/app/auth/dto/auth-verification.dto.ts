import { IsString } from 'class-validator';

export class VerificationDto {
  @IsString()
  verification!: string;
}
