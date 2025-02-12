// /src/annonces/annonce.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { Prestation } from '../_shared/model/prestation.model';
import {
  IPrestationQuery,
  IPrestationService,
  ICreatePrestationDTO,
  IUpdatePrestationDTO,
} from './prestation.service.interface';
import { PrestationFactory } from '../_shared/factory/prestation.factory';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { VLike, VNot } from '../../_shared/framework/orm.clauses';
import { Staff } from '../_shared/model/staff.model';
import { ConfigService } from '@nestjs/config';
import { DeepQueryType } from 'domain/types';
import { ISubscription } from 'admin/_shared/model/subscription.model';

@Injectable()
export class PrestationService implements IPrestationService {
  private readonly logger = new Logger();
  constructor(private marketRepository: IDashboardRepository,
    private configService: ConfigService,
  ) {}
  apiLink = this.configService.get<string>('APP_BASE_URL');

  async add(user: Staff, data: ICreatePrestationDTO): Promise<Prestation> {
    try {
      // Vérifier si une prestation avec le même titre existe déjà
      const { name: title } = data;

      let queryParam: DeepQueryType<Prestation> | DeepQueryType<Prestation>[] = {};
      if (title) queryParam = { ...queryParam, name: VLike(title) };
      const existingAnnonce = await this.marketRepository.prestations.findOne({
        where: queryParam,
      });

      if (existingAnnonce) {
        throw new ConflictException(
          'Prestation with the same name already exists',
        );
      }

      return await this.marketRepository.prestations.create(
        PrestationFactory.create(data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.add');
      throw error;
    }
  }

  async bulk(user: Staff, datas: ICreatePrestationDTO[]): Promise<Prestation[]> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      const prestation: Prestation[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        for (const data of datas) {
          const { name: title } = data;
          let queryParam: DeepQueryType<Prestation> | DeepQueryType<Prestation>[] = {};
          if (title) queryParam = { ...queryParam, name: VLike(title) };
          const existingPrestation = await this.marketRepository.prestations.findOne({
            where: queryParam,
          });
          if(!existingPrestation) {
            prestation.push(PrestationFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(prestation)) {

        return await this.marketRepository.prestations.createMany(prestation );
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.add');
      throw error;
    }
  }

  // Méthode de pagination inchangée
  async fetchAll(param?: IPrestationQuery): Promise<Prestation[]> {
    try {
      if (!DataHelper.isEmpty(param) && param) {
        const { page, limit } = param;
        return await this.marketRepository.prestations.find({
          relations: { subscriptions: { client: true } },
          // where: { isActivated: true },
          // skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC' },
        });
      }
      return await this.marketRepository.prestations.find({
        relations: { subscriptions: { client: true } },
        // where: { isActivated: true },
        order: { updatedAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.fetchAll');
      throw error;
    }
  }

  async fetchClientOwn(
    client: Staff,
    param: IPrestationQuery,
  ): Promise<Prestation[]> {
    try {
      if (param && !DataHelper.isEmpty(param)) {
        const { page, limit, clientID, subscriptionID } = param;
        let queryParam: DeepQueryType<ISubscription> | DeepQueryType<ISubscription>[] = {};
        if (clientID) queryParam = { ...queryParam, client: { id: clientID } };
        if (subscriptionID) queryParam = { ...queryParam, id: subscriptionID };
        return await this.marketRepository.prestations.find({
          relations: { subscriptions: { client: true } },
          where: { subscriptions: queryParam },
          // skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC' },
        });
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.fetchClientOwn');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Prestation> {
    try {
      const annonce = await this.marketRepository.prestations.findOne({
        relations: { subscriptions: { client: true } },
        where: { id },
      });
      return annonce;
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.fetchOne');
      throw error;
    }
  }

  async edit(data: IUpdatePrestationDTO): Promise<Prestation> {
    try {
      const {id, keptImages, name: title} = data;
      const annonce = await this.fetchOne(data.id);
      if (!annonce) throw new NotFoundException('Annonce not found');
      const existed = await this.marketRepository.prestations.findOne({
        where: { id: VNot(id), name: title },
      });
      if (existed) throw new ConflictException('Annonce already exists');
      const images = DataHelper.getImageNames(keptImages, this.apiLink!).concat(data.images ?? []);
          data.images = images ?? data.images;
      return await this.marketRepository.prestations.update(
        PrestationFactory.update(annonce, data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.edit');
      throw error;
    }
  }

  async remove(ids: string[]): Promise<boolean> {
    try {
      const annonces = await this.marketRepository.prestations.findByIds(ids);
      if (DataHelper.isNotEmptyArray(annonces)) {
        await this.marketRepository.prestations.removeMany(annonces);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::PrestationService.remove');
      return false;
    }
  }
}
