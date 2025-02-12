import { Prestation } from '../_shared/model/prestation.model';
import { Staff } from '../_shared/model/staff.model';

export interface ICreatePrestationDTO {
  name?: string;
  description?: string;
  images: string[];
  price: number;
}

export interface IPrestationQuery {
  page?: number;
  limit?: number;
  tags?: string[];
  subscriptionID?: string;
  clientID?: string;
}

export interface IUpdatePrestationDTO extends Partial<ICreatePrestationDTO> {
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
  abstract add(client: Staff, data: ICreatePrestationDTO): Promise<Prestation>;
  abstract bulk(client: Staff, data: ICreatePrestationDTO[]): Promise<Prestation[]>;

  /**
   * Récupère toutes les annonces avec pagination
   * @param page Numéro de page (défaut: 1)
   * @param limit Limite d'éléments par page (défaut: 10)
   * @returns Une liste d'annonces
   */
  abstract fetchAll(param?: IPrestationQuery): Promise<Prestation[]>;
  abstract fetchClientOwn(
    client: Staff,
    param?: IPrestationQuery,
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
  abstract edit(data: Partial<ICreatePrestationDTO>): Promise<Prestation>;

  /**
   * Supprime une annonce par son ID
   * @param id ID de l'annonce à supprimer
   * @returns Un boolean indiquant si la suppression a réussi
   */
  abstract remove(ids: string[]): Promise<boolean>;
}
