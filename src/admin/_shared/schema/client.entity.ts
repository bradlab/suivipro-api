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
import { Client } from '../model/client.model';

@Entity('clients')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class ClientEntity extends ATimestamp implements Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone?: string;

  @Column({ nullable: true }) // will be used for entreprise
  fullname: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  CNI?: string;

  @Column({ nullable: true })
  NIF?: string;

  @Column({ type: 'simple-json', nullable: true })
  gps?: IPosition;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @OneToMany(() => SubscriptionEntity, (store) => store.client, {
    onDelete: 'CASCADE',
  })
  subscriptions: ISubscription[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.client)
  transactions?: Transaction[];
}
