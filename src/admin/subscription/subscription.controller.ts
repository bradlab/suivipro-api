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
import { IStoreService } from './subscription.service.interface';

@ApiTags("Service subscription's management")
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly storeService: IStoreService) {}


  /**
   * Récupère toutes les stores avec pagination
   * @param page Numéro de la page
   * @param limit Nombre d'stores par page
   * @returns Une liste d'stores paginées
   */
  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.storeService.fetchAll(page, limit);
  }

  /**
   * Récupère une store par son ID
   * @param id ID de l'store
   * @returns L'store correspondante
   */
  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.fetchOne(id);
  }


  /**
   * Supprime une store par son ID
   * @param id ID de l'store
   * @returns Un boolean indiquant si la suppression a réussi
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Répond avec le statut 204 (No Content) si la suppression réussit
  async deleteStore(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
