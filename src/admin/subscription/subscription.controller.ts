// /src/stores/store.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetClient } from '../_shared/decorator';
import { Staff } from '../_shared/model/staff.model';
import { IStoreService } from './store.service.interface';
import { CreateStoreDTO, UpdateStoreDTO } from './store.input.dto';

@ApiTags("Service subscription's management")
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly storeService: IStoreService) {}

  /**
   * Crée une nouvelle store pour un client donné
   * @param data Données de l'store
   * @returns L'store créée
   */
  @Post()
  async createStore(@GetClient() client: Staff, @Body() data: CreateStoreDTO) {
    return this.storeService.add(client, data);
  }

  /**
   * Récupère toutes les stores avec pagination
   * @param page Numéro de la page
   * @param limit Nombre d'stores par page
   * @returns Une liste d'stores paginées
   */
  @Get()
  async getAllStores(
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
   * Met à jour une store existante
   * @param id ID de l'store à mettre à jour
   * @param data Données partiellement mises à jour
   * @returns L'store mise à jour
   */
  @Patch()
  async updateStore(
    @Body() data: UpdateStoreDTO, // Utilisation de Partial pour permettre la mise à jour partielle
  ) {
    return this.storeService.edit(data);
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
