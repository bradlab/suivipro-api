/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prestation, OPrestation } from '../model/annonce.model';
import { IUpdateAnnonceDTO } from '../../prestation/annonce.service.interface';
import { ICreateAnnonceDTO } from '../../prestation/annonce.service.interface';
import { StaffFactory } from './staff.factory';
import { StoreFactory } from './store.factory';
import { DataHelper } from 'adapter/helper/data.helper';

export abstract class PrestationFactory {
  static create(data: ICreateAnnonceDTO): Prestation {
    const annonce = new Prestation();
    annonce.store = data.store ?? annonce?.store;
    annonce.price = data.price;
    annonce.tags = data.tags;
    annonce.title = data.title;
    annonce.images = data.images;
    annonce.quantity = data.quantity;
    annonce.description = data.description;

    return annonce;
  }

  static update(annonce: Prestation, data: IUpdateAnnonceDTO): Prestation {
    // fais la modification des données de annonce avec le data
    annonce.price = data.price ?? annonce.price;
    annonce.images = data.images ?? annonce.images;
    annonce.tags = data.tags ?? annonce.tags;
    annonce.title = data.title ?? annonce.title;
    annonce.quantity = data.quantity ?? annonce.quantity;
    annonce.description = data.description ?? annonce.description;

    return annonce;
  }

  static getAnnonce(annonce: Prestation): OPrestation {
    if (annonce) {
      return {
        id: annonce.id,
        description: annonce.description,
        quantity: annonce.quantity,
        title: annonce.title,
        tags: annonce.tags,
        price: annonce.price,
        isActivated: annonce.isActivated,
        paid: annonce.paid,
        images: DataHelper.getFileLinks(annonce.images!),
        store: StoreFactory.getStore({ ...annonce.store, client: undefined }),
        user: StaffFactory.getClient(annonce.store?.client!),
        createdAt: annonce.createdAt,
        updatedAt: annonce.updatedAt,
      };
    }
    return null as any;
  }
}
