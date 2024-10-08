import { IsNumber } from 'class-validator';

export class DelateUserDto {
  @IsNumber()
  id!: number;
}
