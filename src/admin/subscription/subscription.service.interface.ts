import { ISubscription } from '../_shared/model/subscription.model';
import { Staff } from '../_shared/model/staff.model';
import { Prestation } from 'admin/_shared/model/prestation.model';
import { Client } from 'admin/_shared/model/client.model';

export interface ICreateSubscriptionDTO {
  prestation?: Prestation;
  client?: Client;
}

export interface IUpdateStoreDTO extends Partial<ICreateSubscriptionDTO> {
  id: string;
}

export abstract class IStoreService {
  /**
   * Ajoute une nouvelle store associée à un client
   * @param data Données de l'store (ICreateStoreDTO)
   * @param clientId ID du client
   * @returns L'store créée
   */
  abstract add(client: Staff, data: ICreateSubscriptionDTO): Promise<ISubscription>;

  /**
   * Récupère toutes les stores avec pagination
   * @param page Numéro de page (défaut: 1)
   * @param limit Limite d'éléments par page (défaut: 10)
   * @returns Une liste d'stores
   */
  abstract fetchAll(page: number, limit: number): Promise<ISubscription[]>;

  /**
   * Récupère une store par son ID
   * @param id ID de l'store
   * @returns L'store correspondante
   */
  abstract fetchOne(id: string): Promise<ISubscription>;

  /**
   * Modifie une store existante
   * @param id ID de l'store à modifier
   * @param data Données partiellement mises à jour (Partial<ICreateStoreDTO>)
   * @returns L'store modifiée
   */
  abstract edit(data: Partial<ICreateSubscriptionDTO>): Promise<ISubscription>;

  /**
   * Supprime une store par son ID
   * @param id ID de l'store à supprimer
   * @returns Un boolean indiquant si la suppression a réussi
   */
  abstract remove(id: string): Promise<boolean>;
}
