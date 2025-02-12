import { IPosition, ITimestamp } from 'domain/interface';
import { Prestation, OPrestation } from './annonce.model';
import { Client, OClient } from './client.model';

export class ISubscription extends ITimestamp {
  id: string;
  name: string;
  address?: string;
  gps?: IPosition;
  isActivated: boolean;
  isDefault: boolean;
  client?: Client;
  prestation?: Prestation;
}

export interface OSubscription extends Partial<Omit<ISubscription, 'client' | 'annonces'>> {
  client?: OClient;
  annonce?: OPrestation;
}
