import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { Roles } from './roles.decorator';
import { Role } from '../../common/enums/rol.enum';
import { RolesGuard } from '../guard/roles.guard';

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
