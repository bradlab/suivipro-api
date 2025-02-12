import { Person } from 'domain/interface/person.model';
import { Transaction } from './transaction.model';
import { OSubscription, ISubscription } from './subscription.model';
import { IPosition } from 'domain/interface';

export class Staff extends Person {
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
}

export interface OStaff extends Partial<Omit<Staff, 'stores'>> {
  id: string;
  stores?: OSubscription[];
}

export interface SignedStaff extends OStaff {
  accessToken: string;
}
