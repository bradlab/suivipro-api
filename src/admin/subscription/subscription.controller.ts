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
    return this.subscriptionService.fetchAll(param);
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
    return this.subscriptionService.fetchOne(id);
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
