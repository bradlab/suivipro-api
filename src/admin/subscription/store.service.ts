// /src/stores/store.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ISubscription } from '../_shared/model/subscription.model';
import { ICreateStoreDTO, IUpdateStoreDTO } from './store.service.interface';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { VLike, VNot } from '../../_shared/framework/orm.clauses';
import { Staff } from '../_shared/model/staff.model';
import { StoreFactory } from '../_shared/factory/store.factory';

@Injectable()
export class StoreService {
  private readonly logger = new Logger();

  constructor(private marketRepository: IDashboardRepository) {}

  async add(client: Staff, data: ICreateStoreDTO): Promise<ISubscription> {
    try {
      // Vérifier si une store avec le même titre existe déjà
      const { client } = data;
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      data.client = client;
      const existingStore = await this.marketRepository.subscriptions.findOne({
        where: { client: { id: client?.id }, name: VLike(data.name) },
      });

      if (existingStore) {
        throw new ConflictException('Store with the same type already exists');
      }

      return await this.marketRepository.subscriptions.create(
        StoreFactory.create(data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::StoreService.add');
      throw error;
    }
  }

  // Méthode de pagination inchangée

  async fetchOne(id: string): Promise<ISubscription> {
    const store = await this.marketRepository.subscriptions.findOne({
      relations: { client: true },
      where: { id },
    });
    return store;
  }

  async edit(data: IUpdateStoreDTO): Promise<ISubscription> {
    const store = await this.fetchOne(data.id);
    if (!store) throw new NotFoundException('Store not found');
    const existed = data.name ? await this.marketRepository.subscriptions.findOne({
      where: { id: VNot(data.id), name: VLike(data.name) },
    }) : undefined;
    if (existed) throw new ConflictException('Store already exists');
    return await this.marketRepository.subscriptions.update(
      StoreFactory.update(store, data),
    );
  }

  async remove(ids: string[]): Promise<boolean> {
    const stores = await this.marketRepository.subscriptions.findByIds(ids);
    if (DataHelper.isNotEmptyArray(stores)) {
      await this.marketRepository.subscriptions.removeMany(stores);
      return true;
    }
    return false;
  }
}
