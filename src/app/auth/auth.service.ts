import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { DelateUserDto } from './dto/id-delate.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // mailer
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_TRANSPORT_USER,
        pass: process.env.MAIL_TRANSPORT_PASS,
      },
    });
    return transporter;
  }

  async register({ name, lastname, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const registration = await this.usersService.create({
      name,
      lastname,
      email,
      password: await bcryptjs.hash(password, 12),
    });

    console.log(registration);

    return {
      name,
      email,
    };
  }

  // Ingreso
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    const user2 = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos',
      );
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos ',
      );
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
    };

    const token = await this.jwtService.signAsync(payload);
    console.log(user2);

    return {
      token: token,
      email: user.email,
    };
  }

  // Ingreso
  async loginAuthentication({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos',
      );
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos',
      );
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
  }

  // Todos los usuarios
  async profile({ email, role }: { email: string; role: string }) {
    console.log(email, role);
    return await this.usersService.findAll();
  }

  async updateRole({ id, role }: UpdateRoleDto) {
    return await this.usersService.updateRoleUser(id!, role!);
  }

  // Recuperar cuenta
  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;
    return `REPASS${email}`;
  }

  // Eliminar usuario

  async deleteUser({ id }: DelateUserDto) {
    const email = await this.usersService.findOneById(id);
    if (!email) {
      throw new BadRequestException('Email already exists');
    }

    return await this.usersService.delateUserById(id);
  }
}
