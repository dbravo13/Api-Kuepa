/* eslint-disable prettier/prettier */
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../common/enums/rol.enum';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['email'],
    });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'lastname', 'email', 'password', 'role'],
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  // cambiar rol
  async updateRoleUser(id: number, role: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      let newRole: Role;
      switch (role) {
        case Role.USER:
          newRole = Role.USER;
          break;
        case Role.ADMIN:
          newRole = Role.ADMIN;

          break;
        case Role.DEVELOPER:
          newRole = Role.DEVELOPER;
          break;
        default:
          throw new Error('Invalid role');
      }
      await this.usersRepository.update(id, { role: newRole });
      return { status: 200, message: 'Rol cambiado exitosamente' };
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ resetPasswordToken });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async delateUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (user) {
      await this.usersRepository.delete(id);

      return { status: 200, message: 'User delate' };
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByVerificationCode(authenticationToken: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ authenticationToken });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
