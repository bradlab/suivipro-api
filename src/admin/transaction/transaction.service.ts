// /src/points/point.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  NotAcceptableException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import {
  Transaction,
  TransactionTypeEnum,
} from '../_shared/model/transaction.model';
import { IPointService, IUpdatePointDTO } from './point.service.interface';
import { TransactionFactory } from '../_shared/factory/point.factory';
import { Staff } from '../_shared/model/staff.model';
import { DataHelper } from 'adapter/helper/data.helper';

@Injectable()
export class TransactionService extends IPointService implements OnApplicationBootstrap {
  private readonly logger = new Logger();
  constructor(private readonly marketRepository: IDashboardRepository) {
    super();
  }
  async onApplicationBootstrap() {
    // const trans = await this.marketRepository.points.find({
    //   order: { createdAt: 'DESC' },
    // });

    // if (DataHelper.isNotEmptyArray(trans)) {
    //   trans.map((t => {
    //    // t.createdAt = generateRandomDate('2024-11-01', '2024-11-28');
    //    // t.updatedAt = t.createdAt;
    //    t.updatedAt = generateRandomDate(t.createdAt.toISOString(), '2024-11-29')
    //    t.type = TransactionTypeEnum.CREDIT;
    //   }));

    //   await this.marketRepository.points.updateMany(trans);
    // }
  }

  /**
   * Récupère l'historique des transactions de points pour un client donné
   * @param id ID du client
   * @returns Une liste de transactions de points
   */
  async fetchAll(id: string): Promise<Transaction[]> {
   try {
    //  const trans = await this.marketRepository.points.find({
    //    order: { createdAt: 'DESC' },
    //  });

    //  if (DataHelper.isNotEmptyArray(trans)) {
    //    trans.map((t => {
    //     // t.createdAt = generateRandomDate('2024-11-01', '2024-11-28');
    //     // t.updatedAt = t.createdAt;
    //     t.updatedAt = generateRandomDate(t.createdAt.toISOString(), '2024-11-29')
    //     t.type = TransactionTypeEnum.CREDIT;
    //    }));

    //    await this.marketRepository.points.updateMany(trans);
    //  }

     const operations = await this.marketRepository.transactions.find({
       where: { client: { id } },
       order: { createdAt: 'DESC' },
     });
     return operations;
   } catch (error) {
     this.logger.error(error, 'ERROR::PoistService.fetchAll');
     return [];
   }
  }

  /**
   * Ajoute des points au compte du client
   * @param data Données pour mettre à jour les points
   * @returns La transaction de points enregistrée
   */
  async add(client: Staff, data: IUpdatePointDTO): Promise<Transaction> {
    try {
      if (!client) throw new NotFoundException('Client not found');

      // Mise à jour du solde de points
      
      // Enregistrement de la transaction
      data.client = client;
      data.type = TransactionTypeEnum.AUTOMATIC;
      const transaction = await this.marketRepository.transactions.create(
        TransactionFactory.create(data),
      );
      if (transaction) {
        client.points! += data.points;
        await this.marketRepository.users.update(client);
        return transaction;
      }
      return transaction;
    } catch (error) {
      this.logger.error(error, 'ERROR::PointService.addPoints');
      throw error;
    }
  }

  async addBulk(client: Staff, datum: IUpdatePointDTO[]): Promise<Transaction[]> {
    try {
      if (!client) throw new NotFoundException('Client not found');

      const transactions: Transaction[] = [];
      for (const data of datum) {
        data.client = client;
        data.type = TransactionTypeEnum.AUTOMATIC;
        const transaction = TransactionFactory.create(data);
        transactions.push(transaction);
      }
      if (DataHelper.isNotEmptyArray(transactions)) {
        const points = await this.marketRepository.transactions.createMany(transactions);
        // Enregistrement de la transaction
        client.points! += datum.reduce((a, b) => a + b.points, 0);
        // Mise à jour du solde de points
        await this.marketRepository.users.update(client);
        return points;
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::PointService.addPoints');
      throw error;
    }
  }

  async deductBulk(client: Staff, datum: IUpdatePointDTO[]): Promise<Transaction[]> {
    try {
      if (!client) throw new NotFoundException('Client not found');

      const transactions: Transaction[] = [];
      let balance = client.points ?? 0 ;
      for (const data of datum) {
        if (data.points && data.points < balance) {
          data.client = client;
          data.type = TransactionTypeEnum.MANUAL;
          const transaction = TransactionFactory.create(data);
          transactions.push(transaction);
          balance -= data.points;
        }
      }
      if (DataHelper.isNotEmptyArray(transactions)) {
        const points = await this.marketRepository.transactions.createMany(transactions);
        // Enregistrement de la transaction
        client.points = balance;
        // Mise à jour du solde de points
        await this.marketRepository.users.update(client);
        return points;
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::PointService.addPoints');
      throw error;
    }
  }

  /**
   * Déduit des points du compte du client
   * @param data Données pour mettre à jour les points
   * @returns La transaction de points enregistrée
   */
  async revoke(
    client: Staff,
    data: IUpdatePointDTO,
  ): Promise<Transaction> {
    try {
      const { annonceID, points } = data;
      if (!client) throw new NotFoundException('Client not found');

      // Vérifie si une transaction existe déjà pour cette annonce et ce client
      if (annonceID) {
        const existingTransaction = await this.marketRepository.transactions.findOne({
          where: {
            client,
            subscription: { id: annonceID },
            type: TransactionTypeEnum.MANUAL,
          },
        });
        if (existingTransaction) {
          return existingTransaction; // Accès autorisé sans frais supplémentaires
        }
      }
      
      // Enregistrement de la transaction
      if (client.points && client.points < points) {
        throw new NotAcceptableException('Insufficient points');
      }
      data.client = client;
      data.type = TransactionTypeEnum.MANUAL;
      const transaction = await this.marketRepository.transactions.create(
        TransactionFactory.create(data),
      );
      if (transaction) {
        if (annonceID) {
          const annonce = await this.marketRepository.prestations.findOne({
            where: { id: annonceID },
          });
          if (annonce) {
            annonce.paid = true;
            await this.marketRepository.prestations.update(annonce);
          }
        }
        // Mise à jour du solde de points
        client.points! -= points;
        await this.marketRepository.users.update(client);
      }
      return transaction;
    } catch (error) {
      this.logger.error(error, 'ERROR::PointService.deduct');
      throw error;
    }
  }

  async subscribe(
    client: Staff,
    data: IUpdatePointDTO,
  ): Promise<Staff> {
    try {
      const { annonceID, points } = data;
      if (!client) throw new NotFoundException('Client not found');
      const annonce = await this.marketRepository.prestations.findOne({
        relations: { store: {client: true}},
        where: { id: annonceID },
      });
      if (!annonce) throw new NotFoundException('Annonce not found');
      if (annonce.store?.client) {
        if (annonce.paid) {
          return annonce.store?.client;
        }
        if (points && points > 0) {
          await this.add(client, data);
        }
        if (client.points && client.points < annonce.price) {
          throw new BadRequestException('Insufficient points');
        }
        if (client.points! >= annonce.price) {
          data.points = annonce.price;
          await this.revoke(client, data);
          return annonce.store?.client;
        }
      }
      return client;
    } catch (error) {
      this.logger.error(error, 'ERROR::PointService.pay');
      throw error;
    }
  }

  /**
   * Récupère le solde actuel des points d'un client
   * @param id ID du client
   * @returns Le nombre actuel de points du client
   */
  async getCurrentPoints(id: string): Promise<number> {
    // const client = await this.clientService.fetchOne(id);
    // if (!client) throw new NotFoundException('Client not found');

    // return client.points;
    return id ? 1000 : 0;
  }
}
