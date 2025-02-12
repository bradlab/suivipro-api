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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ISubscriptionService } from './subscription.service.interface';
import { SubscriptionQuery } from 'admin/transaction/transaction.input.dto';

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
  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.fetchOne(id);
  }


  /**
   * Supprime une store par son ID
   * @param id ID de l'store
   * @returns Un boolean indiquant si la suppression a réussi
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Répond avec le statut 204 (No Content) si la suppression réussit
  async deleteStore(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.remove(id);
  }
}
