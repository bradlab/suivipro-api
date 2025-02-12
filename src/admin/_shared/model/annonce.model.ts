import { ITimestamp } from 'domain/interface';
import { WasteTypeEnum } from '../dashboard.enum';
import { OStaff } from './staff.model';
import { OSubscription, ISubscription } from './subscription.model';

export class Prestation extends ITimestamp {
  id: string;
  title?: string;
  description?: string;
  quantity: number; // l'unité de mesure est le gramme
  tags: string[];
  price: number;
  store: ISubscription;
  isActivated?: boolean;
  paid?: boolean;
  images?: string[];
}

export interface OPrestation extends Omit<Prestation, 'store'> {
  user?: OStaff;
  store?: OSubscription;
}
