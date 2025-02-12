import { IPosition } from '../../_shared/domain/interface';
import { ISubscription } from '../_shared/model/subscription.model';
import { Staff } from '../_shared/model/staff.model';

export interface ICreateStoreDTO {
  name: string;
  address?: string;
  gps?: IPosition;
  client?: Staff;
  isDefault?: boolean;
}

export interface IUpdateStoreDTO extends Partial<ICreateStoreDTO> {
  id: string;
}

export abstract class IStoreService {
  /**
   * Ajoute une nouvelle store associée à un client
   * @param data Données de l'store (ICreateStoreDTO)
   * @param clientId ID du client
   * @returns L'store créée
   */
  abstract add(client: Staff, data: ICreateStoreDTO): Promise<ISubscription>;

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
  abstract edit(data: Partial<ICreateStoreDTO>): Promise<ISubscription>;

  /**
   * Supprime une store par son ID
   * @param id ID de l'store à supprimer
   * @returns Un boolean indiquant si la suppression a réussi
   */
  abstract remove(id: string): Promise<boolean>;
}
