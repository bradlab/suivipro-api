import {
  Logger,
  Injectable,
  ConflictException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType, PartialDeep } from 'domain/types';
import { VIn, VNot } from 'framework/orm.clauses';
import { IClientService, ICreateClientDTO, IUpdateClientDTO } from './client.service.interface';
import { IClientQuery } from 'admin/auth/auth.service.interface';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ClientFactory } from 'admin/_shared/factory/client.factory';
import { Client } from 'admin/_shared/model/client.model';
import { Staff } from 'admin/_shared/model/staff.model';
import { ISubscriptionQuery } from 'admin/transaction/transaction.service.interface';

@Injectable()
export class ClientService implements IClientService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}

  async fetchAll(param?: IClientQuery): Promise<Client[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Client> | DeepQueryType<Client>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.clients.find({
          relations: {subscriptions: true, transactions: true},
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.clients.find({
      relations: {subscriptions: true, transactions: true},
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: PartialDeep<Client>): Promise<Client> {
    try {
      return this.dashboardRepository.clients.findOne({where: data});
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Client> {
    return await this.dashboardRepository.clients.findOne({
      relations: { subscriptions: {prestation: true}, transactions: {subscription: {prestation: true}} },
      where: { id },
    });
  }

  async add(data: ICreateClientDTO): Promise<Client> {
    try {
      const { email, phone } = data;
      let existed: Client;
      if (email) existed = await this.search({ email });
      if (phone) existed = await this.search({ phone });
      if (existed!) {
        throw new ConflictException(
          'Business account email or phone number allready exist',
        );
      }
      const client = await this.dashboardRepository.clients.create(
        ClientFactory.create(data),
      );
      return client;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.add');
      throw error;
    }
  }

  async edit(data: IUpdateClientDTO): Promise<Client> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const userInstance = ClientFactory.update(user, data);
        return await this.dashboardRepository.clients.update(userInstance);
      }
      throw new NotFoundException('Client not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.editUser');

      throw error;
    }
  }

  async bulk(staff: Staff, datas: ICreateClientDTO[]): Promise<Client[]> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      const clients: Client[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!staff) {
          throw new NotFoundException('Client not found');
        }
        for (const data of datas) {
          const { phone } = data;
          let queryParam: DeepQueryType<Client> | DeepQueryType<Client>[] = {};
          if (phone) queryParam = { ...queryParam, phone };
          const existingAnnonce = await this.dashboardRepository.clients.findOne({
            where: queryParam,
          });
          if(!existingAnnonce) {
            clients.push(ClientFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(clients)) {

        return await this.dashboardRepository.clients.createMany(clients );
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.add');
      throw error;
    }
  }
  

  async setState(ids: string[]): Promise<boolean> {
    try {
      const users = ids && (await this.dashboardRepository.clients.findByIds(ids));
      if (users?.length > 0) {
        users.map((user) => {
          user.isActivated = !user.isActivated;
          return user;
        });
        return await this.dashboardRepository.clients
          .updateMany(users)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const user = await this.fetchOne(id);
      if (user) {
        return await this.dashboardRepository.clients
          .remove(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.remove');
      throw error;
    }
  }
  
  async clean(): Promise<boolean> {
    try {
      throw new NotImplementedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.remove');
      throw error;
    }
  }
}
