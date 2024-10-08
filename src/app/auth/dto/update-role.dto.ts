import { IsString, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  id?: number;

  @IsString()
  role?: string;
}
