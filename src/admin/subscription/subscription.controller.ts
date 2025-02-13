// /src/stores/store.controller.ts
import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ISubscriptionService } from './subscription.service.interface';
import { SubscriptionQuery } from 'admin/transaction/transaction.input.dto';
import { IDsParamDTO } from 'adapter/param.dto';
import { DocSubscriptionDTO } from './doc.subscription.dto';
import { SubscriptionFactory } from 'admin/_shared/factory/subscription.factory';
import { DataSubItem, ISubscription } from 'admin/_shared/model/subscription.model';

@ApiTags("Service subscription's management")
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: ISubscriptionService) {}


  /**
   * Récupère toutes les stores avec pagination
   * @param page Numéro de la page
   * @param limit Nombre d'stores par page
   * @returns Une liste d'stores paginées
   */
  @ApiOperation({ summary: 'Obtenir la liste des abonnements' })
  @ApiResponse({type: DocSubscriptionDTO, isArray: true})
  @Get()
  async getAll(
    @Query() param: SubscriptionQuery
  ) {
    const subs = await this.subscriptionService.fetchAll(param);
    // const group = this.groupByMonthYear(subs);
    // console.log('GROUPED =========', group);
    return subs.map(sub => SubscriptionFactory.getSubscription(sub));
  }

  groupByMonthYear(data: ISubscription[]): { [key: string]: ISubscription[] } {
    const grouped: { [key: string]: ISubscription[] } = {};
    const monthNames = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin",
                        "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
  
    for (const item of data) {
      const createdAt = new Date(item.createdAt);
      const month = monthNames[createdAt.getMonth()];
      const year = createdAt.getFullYear();
      const key = `${month} ${year}`;
  
      if (grouped[key]) {
        grouped[key].push(item);
      } else {
        grouped[key] = [item];
      }
    }
  
    return grouped;
  }

  /**
   * Récupère une store par son ID
   * @param id ID de l'store
   * @returns L'store correspondante
   */
  @ApiOperation({ summary: 'Récupérer un abonnement' })
  @ApiResponse({type: DocSubscriptionDTO})
  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return SubscriptionFactory.getSubscription(await this.subscriptionService.fetchOne(id));
  }


  /**
   * Supprime une store par son ID
   * @param id ID de l'store
   * @returns Un boolean indiquant si la suppression a réussi
   */
  @ApiOperation({ summary: 'Supprimer un ou +sieur abonnements' })
  @ApiResponse({type: Boolean})
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Répond avec le statut 204 (No Content) si la suppression réussit
  async deleteStore(@Param() {ids}: IDsParamDTO) {
    return this.subscriptionService.remove(ids as any);
  }
}
