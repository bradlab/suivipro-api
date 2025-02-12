// /src/annonces/entities/annonce.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { WasteTypeEnum } from '../dashboard.enum';
import { SubscriptionEntity } from './subscription.entity';
import { ISubscription } from '../model/subscription.model';
import { TransactionEntity } from './transaction.entity';
import { Transaction } from '../model/transaction.model';
import { Prestation } from '../model/prestation.model';

@Entity('prestations')
export class PrestationEntity extends ATimestamp implements Prestation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @Column({type: 'simple-array', nullable: true}) // Pour gérer les images en tant que tableau simple
  images: string[];

  @Column()
  price: number;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.prestation) // Relation avec Store
  subscriptions: ISubscription[];

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.subscription,
    { onDelete: 'SET NULL' },
  ) // Relation avec Transaction
  transactions: Transaction;
}
