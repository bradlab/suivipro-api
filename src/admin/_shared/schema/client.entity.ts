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
import { Transaction } from '../model/transaction.model';
import { TransactionEntity } from './transaction.entity';
import { ISubscription } from '../model/subscription.model';
import { SubscriptionEntity } from './subscription.entity';
import { IPosition } from '../../../_shared/domain/interface';

@Entity('clients')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class ClientEntity extends ATimestamp implements Staff {
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

  @Column({ type: 'simple-json', nullable: true })
  gps?: IPosition;

  @Column({ nullable: true, default: 0 })
  points?: number;

  @Column({ nullable: true, default: 0 })
  bonus?: number;

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

  @Column({ nullable: true, default: false })
  isMerchant?: boolean;

  @OneToMany(() => SubscriptionEntity, (store) => store.client, {
    onDelete: 'CASCADE',
  })
  stores: ISubscription[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.client)
  pointTransactions?: Transaction[];
}
