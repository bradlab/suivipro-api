import { OTransaction, Transaction } from './transaction.model';
import { OSubscription, ISubscription } from './subscription.model';
import { IPosition, ITimestamp } from 'domain/interface';

export class Client extends ITimestamp {
  id: string;
  CNI?: string;
  NIF?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  fullname: string;
  isActivated?: boolean;
  gps?: IPosition;
  description?: string;
  logo?: string;
  // relation
  subscriptions?: ISubscription[];
  transactions?: Transaction[];
}

export interface OClient extends Partial<Omit<Client, 'subscriptions' | 'transactions'>> {
  id: string;
  subscriptions?: OSubscription[];
  transactions?: OTransaction[];
}

export interface SignedClient extends OClient {
  accessToken: string;
}
