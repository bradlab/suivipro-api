import { ITimestamp } from 'domain/interface';
import { Staff } from './staff.model';
import { OPrestation, Prestation } from './annonce.model';
import { OClient } from './client.model';
import { ISubscription, OSubscription } from './subscription.model';

export enum TransactionTypeEnum {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
}

export class Transaction extends ITimestamp {
  id: string;
  clientID?: string; // ID du client associé à la transaction, utilisé dans les DTO
  points: number;
  description?: string;
  type: TransactionTypeEnum;
  client: Staff;
  subscription?: ISubscription;
}

export interface OTransaction
  extends Partial<Omit<Transaction, 'client' | 'subscription'>> {
  client: OClient;
  subscription?: OSubscription;
  prestation?: OPrestation;
}
