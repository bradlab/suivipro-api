import { IPosition, ITimestamp } from 'domain/interface';
import { Prestation, OPrestation } from './prestation.model';
import { Client, OClient } from './client.model';
import { Transaction, SubscriptionTypeEnum } from './transaction.model';

export class ISubscription extends ITimestamp {
  id: string;
  isActivated: boolean;
  type: SubscriptionTypeEnum;
  client?: Client;
  prestation?: Prestation;
  startAt: Date;
  closedAt?: Date;
  transactions?: Transaction[];
}

export interface OSubscription extends Partial<Omit<ISubscription, 'client' | 'prestation'>> {
  client?: OClient;
  prestation?: OPrestation;
}
