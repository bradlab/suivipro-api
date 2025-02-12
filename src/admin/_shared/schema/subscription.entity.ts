import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Transaction,
} from 'typeorm';
import { IPosition } from 'domain/interface';
import { PrestationEntity } from './prestation.entity';
import { Prestation } from '../model/annonce.model';
import { ATimestamp } from 'framework/timestamp.abstract';
import { ISubscription } from '../model/subscription.model';
import { ClientEntity } from './client.entity';
import { Client } from '../model/client.model';
import { TransactionEntity } from './transaction.entity';

@Entity('subscriptions')
export class SubscriptionEntity extends ATimestamp implements ISubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true, type: 'simple-json' })
  gps: IPosition;

  @Column({ default: true })
  isActivated: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => ClientEntity, (client) => client.stores)
  client?: Client;

  @ManyToOne(() => PrestationEntity, (annonce) => annonce.store, {
    onDelete: 'NO ACTION',
  })
  prestation?: Prestation;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.subscription, {
    onDelete: 'NO ACTION',
  })
  transactions?: Transaction[];
}
