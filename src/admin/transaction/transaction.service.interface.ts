import { Client } from 'admin/_shared/model/client.model';
import { Staff } from '../_shared/model/staff.model';
import {
  Transaction,
  SubscriptionTypeEnum,
} from '../_shared/model/transaction.model';
import { ISubscription } from 'admin/_shared/model/subscription.model';
import { Prestation } from 'admin/_shared/model/prestation.model';

export interface IRevokeSubscribe {
  subscriptionID?: string;
}

export interface ISubscriptionQuery {
  transactionID?: string;
  type?: SubscriptionTypeEnum;
  subscriptionID?: string;
  clientID?: string;
  prestationID?: string;
  isValid?: boolean;
}

export interface ISubscribePrestation {
  clientID?: string; // Utilisation de clientID dans le DTO
  client?: Client;
  prestation?: Prestation;
  type: SubscriptionTypeEnum;
  amount?: number;
  prestationID?: string;
  subscription?: ISubscription
}

export abstract class ITransactionService {
  abstract renewSubscription(
    client: Staff,
    data: ISubscribePrestation,
  ): Promise<Transaction>;

  abstract bulk(
    client: Staff,
    data: ISubscribePrestation[],
  ): Promise<Transaction[]>;

  abstract subscribe(
    user: Staff,
    data: ISubscribePrestation,
  ): Promise<ISubscription>;

  abstract revoke(
    user: Staff,
    data: IRevokeSubscribe,
  ): Promise<ISubscription>;

  abstract fetchAll(param: ISubscriptionQuery): Promise<Transaction[]>;
}
