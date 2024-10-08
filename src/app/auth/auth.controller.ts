import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interface/user-active.interface';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DelateUserDto } from './dto/id-delate.dto';
// import { CheckDto } from './dto/check.dto';
// import { VerificationDto } from './dto/auth-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('signin')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Post('signin-authentication')
  loginAuthentication(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.loginAuthentication(loginDto);
  }

  // @Patch('resend')
  // resendCode(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
  //   return this.authService.resendCode(requestResetPasswordDto);
  // }

  @Get('profile')
  @Auth(Role.ESTUDIENTE)
  profile(@ActiveUser() user: ActiveUserInterface) {
    console.log('first');
    return this.authService.profile(user);
  }

  @Patch('role')
  @Auth(Role.ADMIN)
  updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.authService.updateRole(updateRoleDto);
  }

  @Patch('request-reset-password')
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }

  // @Patch('reset-password')
  // resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.resetPassword(resetPasswordDto);
  // }

  @Delete('delete-user')
  deleteUser(@Body() delateUserDto: DelateUserDto) {
    return this.authService.deleteUser(delateUserDto);
  }

  // @Post('check-email')
  // checkEmail(@Body() checkDto: CheckDto) {
  //   return this.authService.checkEmail(checkDto);
  // }

  // @Patch('auth-verification')
  // authVerification(@Body() verificationDto: VerificationDto) {
  //   return this.authService.authVerification(verificationDto);
  // }
}
