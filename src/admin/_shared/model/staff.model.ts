import { Person } from 'domain/interface/person.model';
import { OSubscription } from './subscription.model';

export class Staff extends Person {
  id: string;
  fullname: string;
  username?: string;
  password: string;
  code?: string;
  isActivated?: boolean;
  avatar?: string;
  // relation
}

export interface OStaff extends Partial<Omit<Staff, 'stores'>> {
  id: string;
  stores?: OSubscription[];
}

export interface SignedStaff extends OStaff {
  accessToken: string;
}
