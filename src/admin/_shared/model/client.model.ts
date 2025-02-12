import { Person } from 'domain/interface/person.model';
import { Transaction } from './transaction.model';
import { OSubscription, ISubscription } from './subscription.model';
import { IPosition } from 'domain/interface';

export class Client extends Person {
  id: string;
  fullname: string;
  username?: string;
  password: string;
  code?: string;
  isActivated?: boolean;
  isMerchant?: boolean;
  bonus?: number;
  points?: number;
  gps?: IPosition;
  // relation
  logo?: string;
  subscriptions?: ISubscription[];
  pointTransactions?: Transaction[];
}

export interface OClient extends Partial<Omit<Client, 'stores'>> {
  id: string;
  stores?: OSubscription[];
}

export interface SignedClient extends OClient {
  accessToken: string;
}
