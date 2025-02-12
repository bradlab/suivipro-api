import { Client } from 'admin/_shared/model/client.model';
import { Staff } from '../_shared/model/staff.model';
import {
  Transaction,
  TransactionTypeEnum,
} from '../_shared/model/transaction.model';

export interface IUpdatePointDTO {
  clientID?: string; // Utilisation de clientID dans le DTO
  client?: Staff;
  points: number;
  description?: string;
  type?: TransactionTypeEnum;
  annonceID?: string;
}

export abstract class IPointService {
  abstract add(
    client: Staff,
    data: IUpdatePointDTO,
  ): Promise<Transaction>;

  abstract addBulk(
    client: Staff,
    data: IUpdatePointDTO[],
  ): Promise<Transaction[]>;

  abstract deductBulk(
    client: Staff,
    data: IUpdatePointDTO[],
  ): Promise<Transaction[]>;

  abstract subscribe(
    client: Staff,
    data: Partial<IUpdatePointDTO>,
  ): Promise<Client>;

  abstract revoke(
    client: Staff,
    data: IUpdatePointDTO,
  ): Promise<Transaction>;

  abstract fetchAll(clientId: string): Promise<Transaction[]>;

  abstract getCurrentPoints(clientId: string): Promise<number>;
}
