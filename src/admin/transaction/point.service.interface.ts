import { Client } from 'admin/_shared/model/client.model';
import { Staff } from '../_shared/model/staff.model';
import {
  Transaction,
  TransactionTypeEnum,
} from '../_shared/model/transaction.model';
import { ISubscription } from 'admin/_shared/model/subscription.model';
import { Prestation } from 'admin/_shared/model/prestation.model';

export interface IRevokeSubscribe {
  subscriptionID?: string;
}
export interface ISubscribePrestation {
  clientID?: string; // Utilisation de clientID dans le DTO
  client?: Client;
  prestation?: Prestation;
  type: TransactionTypeEnum;
  amount?: number;
  prestationID?: string;
  subscription?: ISubscription
}

export abstract class ITransactionService {
  abstract add(
    client: Staff,
    data: ISubscribePrestation,
  ): Promise<Transaction>;

  abstract addBulk(
    client: Staff,
    data: ISubscribePrestation[],
  ): Promise<Transaction[]>;

  abstract deductBulk(
    client: Staff,
    data: ISubscribePrestation[],
  ): Promise<Transaction[]>;

  abstract subscribe(
    client: Staff,
    data: Partial<ISubscribePrestation>,
  ): Promise<Client>;

  abstract revoke(
    user: Staff,
    data: IRevokeSubscribe,
  ): Promise<ISubscription>;

  abstract fetchAll(clientId: string): Promise<Transaction[]>;
}
