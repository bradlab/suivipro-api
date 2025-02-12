// /src/stores/store.service.ts
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ISubscription } from '../_shared/model/subscription.model';
import { ICreateSubscriptionDTO, ISubscriptionService } from './subscription.service.interface';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { Staff } from '../_shared/model/staff.model';
import { SubscriptionFactory } from '../_shared/factory/subscription.factory';
import { DeepQueryType } from 'domain/types';
import { ISubscriptionQuery } from 'admin/transaction/transaction.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private readonly logger = new Logger();

  constructor(private dashboardRepository: IDashboardRepository) {}

  async editManySubscriptions(subs: ISubscription[]): Promise<void> {
    try {
      if (DataHelper.isNotEmptyArray(subs)) {
        await this.dashboardRepository.subscriptions.updateMany(subs);
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.fetchAll');
    }
  }

  async fetchAll(param: ISubscriptionQuery): Promise<ISubscription[]> {
    try {
      let queryParam: DeepQueryType<ISubscription> | DeepQueryType<ISubscription>[] = {};
      if (!DataHelper.isEmpty(param)) {
        const {type, clientID, subscriptionID, transactionID, prestationID, isValid} = param;
        if (subscriptionID) queryParam = {...queryParam, id: subscriptionID};
        if (isValid) queryParam = {...queryParam, isActivated: isValid};
        if (type) queryParam = {...queryParam, type};
        if (clientID) queryParam = {...queryParam, client: {id: clientID}};
        if (transactionID) queryParam = {...queryParam, transactions: {id: transactionID}};
        if (prestationID) queryParam = {...queryParam, prestation: {id: prestationID}};
      }
      return await this.dashboardRepository.subscriptions.find({
        relations: { client: true, prestation: true,  },
        where: { ...queryParam },
      });
      // subscriptions.map((sub) => {
      //   if (!sub.dueDate) {
      //     const {from, to} = getIntervalDates(1, true, PeriodUnitEnum.DAY);
      //     console.log('FROM =========', {from, to})
      //     sub.dueDate = to;
      //   }
      // });
      // await this.dashboardRepository.subscriptions.updateMany(subscriptions);
      // return subscriptions;
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.fetchAll');
      throw error;
    }
  }

  async add(client: Staff, data: ICreateSubscriptionDTO): Promise<ISubscription> {
    try {
      // Vérifier si une store avec le même titre existe déjà
      const { client } = data;
      // if (!client) {
      //   throw new NotFoundException('Client not found');
      // }
      // data.client = client;
      // const existingStore = await this.marketRepository.subscriptions.findOne({
      //   where: { client: { id: client?.id }, name: VLike(data.name) },
      // });

      // if (existingStore) {
      //   throw new ConflictException('Store with the same type already exists');
      // }

      return await this.dashboardRepository.subscriptions.create(
        SubscriptionFactory.create(data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::StoreService.add');
      throw error;
    }
  }

  // Méthode de pagination inchangée

  async fetchOne(id: string): Promise<ISubscription> {
    const store = await this.dashboardRepository.subscriptions.findOne({
      relations: { client: true },
      where: { id },
    });
    return store;
  }

  async remove(ids: string[]): Promise<boolean> {
    const stores = await this.dashboardRepository.subscriptions.findByIds(ids);
    if (DataHelper.isNotEmptyArray(stores)) {
      await this.dashboardRepository.subscriptions.removeMany(stores);
      return true;
    }
    return false;
  }
}
