import { Prestation } from '../_shared/model/annonce.model';
import { Staff } from '../_shared/model/staff.model';
import { ISubscription } from '../_shared/model/subscription.model';

export interface ICreateAnnonceDTO {
  title?: string;
  description?: string;
  quantity: number;
  images: string[];
  tags: string[]; // Tableau de tags
  price: number;
  client?: Staff;
  storeID?: string;
  store?: ISubscription;
}

export interface IAnnonceQuery {
  page?: number;
  limit?: number;
  tags?: string[];
  storeID?: string;
  clientID?: string;
}

export interface IUpdateAnnonceDTO extends Partial<ICreateAnnonceDTO> {
  id: string;
  keptImages?: string[];
}

export abstract class IPrestationService {
  /**
   * Ajoute une nouvelle annonce associée à un client
   * @param data Données de l'annonce (ICreateAnnonceDTO)
   * @param clientId ID du client
   * @returns L'annonce créée
   */
  abstract add(client: Staff, data: ICreateAnnonceDTO): Promise<Prestation>;
  abstract bulk(client: Staff, data: ICreateAnnonceDTO[]): Promise<Prestation[]>;

  /**
   * Récupère toutes les annonces avec pagination
   * @param page Numéro de page (défaut: 1)
   * @param limit Limite d'éléments par page (défaut: 10)
   * @returns Une liste d'annonces
   */
  abstract fetchAll(param?: IAnnonceQuery): Promise<Prestation[]>;
  abstract fetchClientOwn(
    client: Staff,
    param?: IAnnonceQuery,
  ): Promise<Prestation[]>;

  /**
   * Récupère une annonce par son ID
   * @param id ID de l'annonce
   * @returns L'annonce correspondante
   */
  abstract fetchOne(id: string): Promise<Prestation>;

  /**
   * Modifie une annonce existante
   * @param id ID de l'annonce à modifier
   * @param data Données partiellement mises à jour (Partial<ICreateAnnonceDTO>)
   * @returns L'annonce modifiée
   */
  abstract edit(data: Partial<ICreateAnnonceDTO>): Promise<Prestation>;

  /**
   * Supprime une annonce par son ID
   * @param id ID de l'annonce à supprimer
   * @returns Un boolean indiquant si la suppression a réussi
   */
  abstract remove(ids: string[]): Promise<boolean>;
}
