import { ISubscription } from '../_shared/model/subscription.model';
import { Staff } from '../_shared/model/staff.model';
import { Prestation } from 'admin/_shared/model/prestation.model';
import { Client } from 'admin/_shared/model/client.model';
import { SubscriptionTypeEnum } from 'admin/_shared/model/transaction.model';
import { ISubscriptionQuery } from 'admin/transaction/transaction.service.interface';

export interface ICreateSubscriptionDTO {
  type: SubscriptionTypeEnum;
  prestation?: Prestation;
  client?: Client;
}

export abstract class ISubscriptionService {
  /**
   * Ajoute une nouvelle abonnement associée à un client
   * @param data Données de l'abonnement (ICreateSubscriptionDTO)
   * @param clientId ID du client
   * @returns L'abonnement créée
   */
  abstract add(client: Staff, data: ICreateSubscriptionDTO): Promise<ISubscription>;

  /**
   * Récupère toutes les abonnements avec pagination
   * @param page Numéro de page (défaut: 1)
   * @param limit Limite d'éléments par page (défaut: 10)
   * @returns Une liste d'abonnements
   */
  abstract fetchAll(param: ISubscriptionQuery): Promise<ISubscription[]>;

  /**
   * Récupère une abonnement par son ID
   * @param id ID de l'abonnement
   * @returns L'abonnement correspondante
   */
  abstract fetchOne(id: string): Promise<ISubscription>;

  /**
   * Modifie une abonnement existante
   * @param id ID de l'abonnement à modifier
   * @param data Données partiellement mises à jour (Partial<ICreateSubscriptionDTO>)
   * @returns L'abonnement modifiée
   */
  abstract edit(data: Partial<ICreateSubscriptionDTO>): Promise<ISubscription>;

  /**
   * Supprime une abonnement par son ID
   * @param id ID de l'abonnement à supprimer
   * @returns Un boolean indiquant si la suppression a réussi
   */
  abstract remove(id: string): Promise<boolean>;
}
