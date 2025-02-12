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
import { IClientService, IUpdateClientDTO } from './client.service.interface';
import { IClientQuery } from 'admin/auth/auth.service.interface';
import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { IMarketAuthService } from '../auth/auth.service.interface';
import { StoreFactory } from '../_shared/factory/store.factory';
import { ClientFactory } from 'admin/_shared/factory/client.factory';
import { Client } from 'admin/_shared/model/client.model';

@Injectable()
export class ClientService implements IClientService {
  private readonly logger = new Logger();
  constructor(
    private marketRepository: IDashboardRepository,
    private authService: IMarketAuthService,
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
        return await this.marketRepository.clients.find({
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.marketRepository.clients.find({
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: PartialDeep<Client>): Promise<Client> {
    try {
      return this.authService.search(data);
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Client> {
    return await this.marketRepository.clients.findOne({
      relations: { subscriptions: true },
      where: { id },
    });
  }

  async add(data: IRegisterClientDTO): Promise<Client> {
    try {
      const { email, phone } = data;
      let existed: Client;
      if (email) existed = await this.authService.search({ email });
      if (phone) existed = await this.authService.search({ phone });
      if (existed!) {
        throw new ConflictException(
          'Employee account email or phone number allready exist',
        );
      }
      const client = await this.marketRepository.clients.create(
        await ClientFactory.create(data),
      );
      if (client) {
        const store = StoreFactory.create({
          client,
          name: client.fullname,
          address: client.address,
          gps: client.gps,
          isDefault: true,
        });
        await this.marketRepository.subscriptions.create(store);
      }
      return client;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.add');
      throw error;
    }
  }

  async editCredential(
    user: Client,
    data: IUpdateClientDTO,
    isEdit?: boolean,
  ): Promise<boolean> {
    try {
      const client = await this.fetchOne(user?.id);
      if (client) {
        let existedUser: Client;
        if (data.email) {
          existedUser = await this.marketRepository.clients.findOne({
            where: { email: data.email, id: VNot(client.id) },
          });
        }
        if (data.phone) {
          existedUser = await this.marketRepository.clients.findOne({
            where: { phone: data.phone, id: VNot(client.id) },
          });
        }
        if (existedUser!) {
          throw new ConflictException('Email or phone number allready exist');
        }
        if (isEdit) return true;
        const newUser = await this.marketRepository.clients.update(
          ClientFactory.updateUsername(client, data),
        );
        if (newUser) {
          return true;
        }
        return false;
      }
      throw new NotFoundException('Client not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.editCredential');

      throw error;
    }
  }

  async edit(data: IUpdateClientDTO): Promise<Client> {
    try {
      const { id, phone, email } = data;
      const user = await this.fetchOne(id);
      let updateAll = false;
      if (user) {
        if (
          (email && email !== user.email) ||
          (phone && phone !== user.phone)
        ) {
          updateAll = await this.editCredential(
            user,
            { id, phone, email },
            true,
          );
        }
        const userInstance = ClientFactory.update(user, data, updateAll);
        return await this.marketRepository.clients.update(userInstance);
      }
      throw new NotFoundException('Client not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.editUser');

      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    try {
      const users = ids && (await this.marketRepository.clients.findByIds(ids));
      if (users?.length > 0) {
        users.map((user) => {
          user.isActivated = !user.isActivated;
          return user;
        });
        return await this.marketRepository.users
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
        return await this.marketRepository.users
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
