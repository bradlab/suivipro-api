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
import { IRevokeSubscribe, ISubscribePrestation, ITransactionService } from './point.service.interface';
import { TransactionFactory } from '../_shared/factory/transaction.factory';
import { Staff } from '../_shared/model/staff.model';
import { DataHelper } from 'adapter/helper/data.helper';
import { Client } from 'admin/_shared/model/client.model';
import { ISubscription } from 'admin/_shared/model/subscription.model';
import { IPrestationService } from 'admin/prestation/prestation.service.interface';
import { SubscriptionFactory } from 'admin/_shared/factory/subscription.factory';

@Injectable()
export class TransactionService extends ITransactionService {
  private readonly logger = new Logger();
  constructor(
    private readonly marketRepository: IDashboardRepository,
    private readonly prestationService: IPrestationService
  ) {
    super();
  }

  async fetchOneClient(id: string) {
    if (id)
    return await this.marketRepository.clients.findOne({where: {id}})
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
  async add(user: Staff, data: ISubscribePrestation): Promise<Transaction> {
    try {
      if (!user) throw new NotFoundException('Client not found');

      // Mise à jour du solde de points
      
      // Enregistrement de la transaction
      // data.client = user;
      const transaction = await this.marketRepository.transactions.create(
        TransactionFactory.create(data),
      );
      if (transaction) {
        // client.points! += data.points;
        await this.marketRepository.users.update(user);
        return transaction;
      }
      return transaction;
    } catch (error) {
      this.logger.error(error, 'ERROR::TransactionService.addPoints');
      throw error;
    }
  }

  async addBulk(user: Staff, datum: ISubscribePrestation[]): Promise<Transaction[]> {
    try {
      if (!user) throw new NotFoundException('Client not found');

      const transactions: Transaction[] = [];
      for (const data of datum) {
        data.client = user;
        data.type = TransactionTypeEnum.AUTOMATIC;
        const transaction = TransactionFactory.create(data);
        transactions.push(transaction);
      }
      if (DataHelper.isNotEmptyArray(transactions)) {
        const points = await this.marketRepository.transactions.createMany(transactions);
        // Enregistrement de la transaction
        // user.points! += datum.reduce((a, b) => a + b.points, 0);
        // Mise à jour du solde de points
        await this.marketRepository.users.update(user);
        return points;
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::TransactionService.addPoints');
      throw error;
    }
  }

  async deductBulk(user: Staff, datum: ISubscribePrestation[]): Promise<Transaction[]> {
    try {
      if (!user) throw new NotFoundException('Client not found');

      const transactions: Transaction[] = [];
      for (const data of datum) {
        const { clientID, prestationID } = data;
        data.client = await this.fetchOneClient(clientID!);
        data.prestation = await this.prestationService.fetchOne(prestationID!);
        if (data.client && data.prestation) {
          const transaction = TransactionFactory.create(data);
          transactions.push(transaction);
        }
      }
      if (DataHelper.isNotEmptyArray(transactions)) {
        const points = await this.marketRepository.transactions.createMany(transactions);
        return points;
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::TransactionService.addPoints');
      throw error;
    }
  }

  /**
   * Déduit des points du compte du client
   * @param data Données pour mettre à jour les points
   * @returns La transaction de points enregistrée
   */
  async revoke(
    user: Staff,
    data: IRevokeSubscribe,
  ): Promise<ISubscription> {
    try {
      const { subscriptionID } = data;
      const subscription = await this.marketRepository.subscriptions.findOne({where: {id: subscriptionID}});
      if (!subscription) throw new NotFoundException('subscription not found');

      // Vérifie si une transaction existe déjà pour cette annonce et ce client
      if (subscriptionID) {
        const existingTransaction = await this.marketRepository.transactions.findOne({
          where: {
            subscription: { id: subscriptionID },
            isActivated: true,
          },
        });
        if (existingTransaction) {
          existingTransaction.isActivated = false;
          subscription.closedAt = new Date();
          await this.marketRepository.transactions.update(existingTransaction);
          await this.marketRepository.subscriptions.update(subscription);
        }
      }
      
      return subscription;
    } catch (error) {
      this.logger.error(error, 'ERROR::TransactionService.deduct');
      throw error;
    }
  }

  async subscribe(
    user: Staff,
    data: ISubscribePrestation,
  ): Promise<Client> {
    try {
      const { prestationID, clientID } = data;
      const client = await this.fetchOneClient(clientID!);
      const prestation = await this.prestationService.fetchOne(prestationID!);
      if (client && prestation) {
        const existedSubscription = await this.marketRepository.subscriptions.findOne({
          where: {
            client: { id: clientID },
            prestation: { id: prestationID },
          }
        });
        if (existedSubscription) {
          if (existedSubscription.isActivated) {
            throw new NotAcceptableException('Subscription already exists');
          } else {
            existedSubscription.isActivated = true;
            existedSubscription.closedAt = null as any;
            await this.marketRepository.subscriptions.update(existedSubscription);
          }
        } else {
          const subData = SubscriptionFactory.create({
            client,
            prestation,
          });
          const subscription = await this.marketRepository.subscriptions.create(subData);
          if (subscription) {
            data.client = client;
            data.subscription = subscription;
            await this.marketRepository.transactions.create(
              TransactionFactory.create(data),
            )
          }
        }
      }
      throw new NotFoundException('Client or Prestation not found');
    } catch (error) {
      this.logger.error(error, 'ERROR::TransactionService.pay');
      throw error;
    }
  }
}
