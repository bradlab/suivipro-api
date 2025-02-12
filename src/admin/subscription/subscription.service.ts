// /src/stores/store.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ISubscription } from '../_shared/model/subscription.model';
import { ICreateSubscriptionDTO, IUpdateStoreDTO } from './subscription.service.interface';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { Staff } from '../_shared/model/staff.model';
import { SubscriptionFactory } from '../_shared/factory/subscription.factory';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger();

  constructor(private dashboardRepository: IDashboardRepository) {}

  async fetchAll(query: any): Promise<ISubscription[]> {
    try {
      return await this.dashboardRepository.subscriptions.find({
        relations: { client: true, prestation: true,  },
        where: { ...query },
      });
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
