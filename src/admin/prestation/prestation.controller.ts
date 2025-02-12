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
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { diskStorage } from 'multer';

import {
  PrestationQuery,
  CreatePrestationDTO,
  UpdateAnnonceDTO,
} from './prestation.input.dto';
import { IPrestationService } from './prestation.service.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { GetClient } from '../_shared/decorator';
import { Staff } from '../_shared/model/staff.model';
import { DocPrestationDTO } from './doc.prestation.dto';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { IDsParamDTO } from 'adapter/param.dto';
import { PrestationFactory } from '../_shared/factory/prestation.factory';
import { OPrestation } from '../_shared/model/prestation.model';
import { BaseConfig } from 'config/base.config';
import { DataHelper } from 'adapter/helper/data.helper';
import { Public } from 'adapter/decorator';

@ApiTags('Prestations management')
@ApiBearerAuth()
@UseGuards(StaffGuard)
@Controller('prestations')
export class PrestationController {
  constructor(private readonly prestationService: IPrestationService) {}

  /**
   * Crée une nouvelle prestation pour un client donné
   * @param data Données de l'prestation
   * @returns L'prestation créée
   */
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle prestation' })
  @ApiResponse({
    status: 200,
    description: "L'prestation a été créée avec succès",
    type: DocPrestationDTO,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 4 }], {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
    }),
  )
  async createAnnonce(
    @GetClient() client: Staff,
    @Body() data: CreatePrestationDTO,
    @UploadedFiles() upload: Record<string, File[]>,
  ) {
    data.images = upload ? DataHelper.getFiles(upload.images as any) : undefined as any;
    return PrestationFactory.getPrestation(
      await this.prestationService.add(client, data),
    );
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Créer une nouvelle liste de prestations' })
  @ApiResponse({
    status: 200,
    description: "Prestation a été créée avec succès",
    type: DocPrestationDTO,
  })
  async bulk(
    @GetClient() client: Staff,
    @Body() datas: CreatePrestationDTO[],
  ) {
    const prestations = await this.prestationService.bulk(client, datas);
    return prestations?.map((prestation) => PrestationFactory.getPrestation(prestation));
  }

  @Get('search')
  @ApiOperation({ summary: "Récupérer la liste des prestations d'un client" })
  @ApiResponse({
    isArray: true,
    type: DocPrestationDTO,
  })
  async getClientAnnonces(
    @GetClient() client: Staff,
    @Query() param: PrestationQuery,
  ) {
    const ads = await this.prestationService.fetchClientOwn(client, param);
    return ads?.map((prestation) => PrestationFactory.getPrestation(prestation));
  }

  /**
   * Récupère toutes les prestations avec pagination
   * @param page Numéro de la page
   * @param limit Nombre d'prestations par page
   * @returns Une liste d'prestations paginées
   */
  @Get()
  @ApiOperation({ summary: "Récupérer la liste des prestations d'un client" })
  @ApiResponse({
    isArray: true,
    type: DocPrestationDTO,
  })
  async getAllAnnonces(@Query() param: PrestationQuery) {
    const prestations = await this.prestationService.fetchAll(param);
    return prestations?.map((prestation) => PrestationFactory.getPrestation(prestation, false));
  }

  /**
   * Récupère une prestation par son ID
   * @param id ID de l'prestation
   * @returns L'prestation correspondante
   */
  @ApiOperation({ summary: 'Récupérer une prestation par son ID' })
  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return PrestationFactory.getPrestation(await this.prestationService.fetchOne(id));
  }

  /**
   * Met à jour une prestation existante
   * @param id ID de l'prestation à mettre à jour
   * @param data Données partiellement mises à jour
   * @returns L'prestation mise à jour
   */
  @ApiOperation({ summary: 'Mettre à jour une prestation existante' })
  @ApiResponse({
    status: 200,
    description: "L'prestation a été mise à jour avec succès",
    type: DocPrestationDTO,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 4 }], {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
    }),
  )
  @Patch()
  async updateAnnonce(
    @GetClient() client: Staff,
    @Body() data: UpdateAnnonceDTO, // Utilisation de Partial pour permettre la mise à jour partielle
    @UploadedFiles() upload: Record<string, File[]>,
  ): Promise<OPrestation> {
    data.images = upload ? DataHelper.getFiles(upload.images as any) : undefined;
    console.log('UPDATE ======== ANNONCE', data);
    return PrestationFactory.getPrestation(await this.prestationService.edit(data));
  }

  /**
   * Supprime une prestation par son ID
   * @param id ID de l'prestation
   * @returns Un boolean indiquant si la suppression a réussi
   */
  @ApiOperation({ summary: 'Supprimer une prestation par son ID' })
  @ApiResponse({ type: Boolean })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Répond avec le statut 204 (No Content) si la suppression réussit
  async deleteAnnonce(@Param() { ids }: IDsParamDTO) {
    return this.prestationService.remove(ids!);
  }
}
