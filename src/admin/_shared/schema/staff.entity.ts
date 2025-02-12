import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SexEnum } from 'app/enum';
import { Staff } from '../model/staff.model';
import { IPosition } from '../../../_shared/domain/interface';

@Entity('users')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class StaffEntity extends ATimestamp implements Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true }) // will be used for entreprise
  fullname: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, enum: SexEnum })
  sex?: SexEnum;

  @Column({ nullable: true })
  country?: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;
}
