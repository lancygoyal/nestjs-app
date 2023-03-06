import { DATE } from 'sequelize';
import { Table, Column, Model, Index } from 'sequelize-typescript';

@Table({ timestamps: true })
export class User extends Model {
  @Column({
    primaryKey: true,
    unique: true,
  })
  id: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  phoneNumber: string;

  @Column
  hash: string;

  @Column
  salt: string;

  @Index('USER_ROLE')
  @Column
  role: string;

  @Index('USER_TYPE')
  @Column
  type: string;

  @Index('USER_STATUS')
  @Column
  status: string;

  @Column
  bio: string;

  @Column({ type: DATE })
  loginAt: typeof DATE;
}
