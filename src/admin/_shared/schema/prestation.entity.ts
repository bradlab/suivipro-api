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
import { Prestation } from '../model/annonce.model';

@Entity('prestations')
export class PrestationEntity extends ATimestamp implements Prestation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  quantity: number;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @Column({ nullable: true, default: false })
  paid?: boolean;

  @Column({type: 'simple-array', nullable: true}) // Pour gérer les tags en tant que tableau simple
  tags: string[]; // ex: ['tuyaux', 'emballages']

  @Column({type: 'simple-array', nullable: true}) // Pour gérer les images en tant que tableau simple
  images: string[];

  @Column()
  price: number;

  @ManyToOne(() => SubscriptionEntity, (store) => store.prestation) // Relation avec Store
  store: ISubscription;

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.subscription,
    { onDelete: 'SET NULL' },
  ) // Relation avec Transaction
  transactions: Transaction;
}
