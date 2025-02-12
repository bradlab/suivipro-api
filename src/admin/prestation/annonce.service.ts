// /src/annonces/annonce.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { Prestation } from '../_shared/model/annonce.model';
import {
  IAnnonceQuery,
  IPrestationService,
  ICreateAnnonceDTO,
  IUpdateAnnonceDTO,
} from './annonce.service.interface';
import { PrestationFactory } from '../_shared/factory/prestation.factory';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { VLike, VNot } from '../../_shared/framework/orm.clauses';
import { Staff } from '../_shared/model/staff.model';
import { ConfigService } from '@nestjs/config';
import { DeepQueryType } from 'domain/types';

@Injectable()
export class AnnonceService implements IPrestationService {
  private readonly logger = new Logger();
  constructor(private marketRepository: IDashboardRepository,
    private configService: ConfigService,
  ) {}
  apiLink = this.configService.get<string>('APP_BASE_URL');

  async add(client: Staff, data: ICreateAnnonceDTO): Promise<Prestation> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      data.client = client;
      const { storeID, title } = data;
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      if (storeID) {
        data.store = await this.marketRepository.subscriptions.findOne({
          where: { id: storeID, client: { id: client?.id } },
        });
      }
      if (!data.store) {
        data.store = await this.marketRepository.subscriptions.findOne({
          where: { isDefault: true, client: { id: client?.id } },
        });
      }
      let queryParam: DeepQueryType<Prestation> | DeepQueryType<Prestation>[] = {
        store: { id: storeID, client: { id: client?.id }},
      };
      if (title) queryParam = { ...queryParam, title: VLike(title) };
      const existingAnnonce = await this.marketRepository.prestations.findOne({
        where: queryParam,
      });

      if (existingAnnonce) {
        throw new ConflictException(
          'Annonce with the same type already exists',
        );
      }

      // Récupérer le client associé à l'annonce
      // const client = await this.marketRepository.clients.findOne({
      //   where: { id: client?.id },
      // });

      return await this.marketRepository.prestations.create(
        PrestationFactory.create(data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.add');
      throw error;
    }
  }

  async bulk(client: Staff, datas: ICreateAnnonceDTO[]): Promise<Prestation[]> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      const annonces: Prestation[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!client) {
          throw new NotFoundException('Client not found');
        }
        const store = await this.marketRepository.subscriptions.findOne({
          where: { isDefault: true, client: { id: client?.id } },
        });
        for (const data of datas) {
          const { storeID, title } = data;
          data.client = client;
          let queryParam: DeepQueryType<Prestation> | DeepQueryType<Prestation>[] = {
            store: { id: storeID, client: { id: client?.id }},
          };
          if (title) queryParam = { ...queryParam, title: VLike(title) };
          const existingAnnonce = await this.marketRepository.prestations.findOne({
            where: queryParam,
          });
          if(!existingAnnonce) {
            data.store = store;
            annonces.push(PrestationFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(annonces)) {

        return await this.marketRepository.prestations.createMany(annonces );
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.add');
      throw error;
    }
  }

  // Méthode de pagination inchangée
  async fetchAll(param?: IAnnonceQuery): Promise<Prestation[]> {
    try {
      if (!DataHelper.isEmpty(param) && param) {
        const { page, limit } = param;
        return await this.marketRepository.prestations.find({
          relations: { store: { client: true } },
          where: { isActivated: true },
          // skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC' },
        });
      }
      return await this.marketRepository.prestations.find({
        relations: { store: { client: true } },
        where: { isActivated: true },
        order: { updatedAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.fetchAll');
      throw error;
    }
  }

  async fetchClientOwn(
    client: Staff,
    param: IAnnonceQuery,
  ): Promise<Prestation[]> {
    try {
      if (client) {
        if (param && !DataHelper.isEmpty(param)) {
          const { page, limit } = param;
          return await this.marketRepository.prestations.find({
            relations: { store: { client: true } },
            where: { store: { client: { id: client?.id } } },
            // skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
          });
        }
        return await this.marketRepository.prestations.find({
          relations: { store: { client: true } },
          where: { store: { client: { id: client?.id } } },
          order: { createdAt: 'DESC' },
        });
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.fetchClientOwn');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Prestation> {
    try {
      const annonce = await this.marketRepository.prestations.findOne({
        relations: { store: { client: true } },
        where: { id },
      });
      return annonce;
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.fetchOne');
      throw error;
    }
  }

  async edit(data: IUpdateAnnonceDTO): Promise<Prestation> {
    try {
      const {id, keptImages, title} = data;
      const annonce = await this.fetchOne(data.id);
      if (!annonce) throw new NotFoundException('Annonce not found');
      const existed = await this.marketRepository.prestations.findOne({
        where: { id: VNot(id), title },
      });
      if (existed) throw new ConflictException('Annonce already exists');
      const images = DataHelper.getImageNames(keptImages, this.apiLink!).concat(data.images ?? []);
          data.images = images ?? data.images;
      return await this.marketRepository.prestations.update(
        PrestationFactory.update(annonce, data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::AnnonceService.edit');
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
      this.logger.error(error, 'ERROR::AnnonceService.remove');
      return false;
    }
  }
}
