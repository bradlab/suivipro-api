/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prestation, OPrestation } from '../model/annonce.model';
import { IUpdateAnnonceDTO } from '../../prestation/annonce.service.interface';
import { ICreateAnnonceDTO } from '../../prestation/annonce.service.interface';
import { StoreFactory } from './subscription.factory';
import { DataHelper } from 'adapter/helper/data.helper';

export abstract class PrestationFactory {
  static create(data: ICreateAnnonceDTO): Prestation {
    const prestation = new Prestation();
    prestation.store = data.store ?? prestation?.store;
    prestation.price = data.price;
    prestation.tags = data.tags;
    prestation.title = data.title;
    prestation.images = data.images;
    prestation.quantity = data.quantity;
    prestation.description = data.description;

    return prestation;
  }

  static update(prestation: Prestation, data: IUpdateAnnonceDTO): Prestation {
    // fais la modification des données de annonce avec le data
    prestation.price = data.price ?? prestation.price;
    prestation.images = data.images ?? prestation.images;
    prestation.tags = data.tags ?? prestation.tags;
    prestation.title = data.title ?? prestation.title;
    prestation.quantity = data.quantity ?? prestation.quantity;
    prestation.description = data.description ?? prestation.description;

    return prestation;
  }

  static getPrestation(prestation: Prestation): OPrestation {
    if (prestation) {
      return {
        id: prestation.id,
        description: prestation.description,
        quantity: prestation.quantity,
        title: prestation.title,
        tags: prestation.tags,
        price: prestation.price,
        isActivated: prestation.isActivated,
        paid: prestation.paid,
        images: DataHelper.getFileLinks(prestation.images!),
        subscription: StoreFactory.getSubscription({ ...prestation.store, client: undefined }),
        createdAt: prestation.createdAt,
        updatedAt: prestation.updatedAt,
      };
    }
    return null as any;
  }
}
