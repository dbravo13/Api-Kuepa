import { Role } from '../../common/enums/rol.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id!: number;

  @Column()
  name!: string;

  @Column()
  lastname!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ type: 'enum', default: Role.ESTUDIENTE, enum: Role })
  role!: Role;

  @Column({ nullable: false, select: false })
  password!: string;

  @Column({
    type: 'uuid',
    unique: true,
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken!: string;

  @Column({
    type: 'varchar',
    unique: true,
    name: 'authentication_token',
    nullable: true,
  })
  authenticationToken!: string;
}
