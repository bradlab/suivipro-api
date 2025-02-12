import { ITimestamp } from 'domain/interface';
import { OPrestation, Prestation } from './prestation.model';
import { Client, OClient } from './client.model';
import { ISubscription, OSubscription } from './subscription.model';

export enum TransactionTypeEnum {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
}

export class Transaction extends ITimestamp {
  id: string;
  clientID?: string; // ID du client associé à la transaction, utilisé dans les DTO
  amount: number;
  description?: string;
  type: TransactionTypeEnum;
  client: Client;
  subscription?: ISubscription;
  isActivated?: boolean;
}

export interface OTransaction
  extends Partial<Omit<Transaction, 'client' | 'subscription'>> {
  client: OClient;
  subscription?: OSubscription;
  prestation?: OPrestation;
}
