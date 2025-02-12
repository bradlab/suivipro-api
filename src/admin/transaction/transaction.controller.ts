// /src/points/point.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocTransactionDTO } from './doc.point.dto';
import { PayAnnonceDTO, UpdatePointDTO } from './point.input.dto';
import { OTransaction } from '../_shared/model/transaction.model';
import { IPointService } from './point.service.interface';
import { GetClient } from '../_shared/decorator';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { StaffFactory } from 'admin/_shared/factory/staff.factory';
import { TransactionFactory } from 'admin/_shared/factory/point.factory';
import { ClientGuard } from 'admin/_shared/guard/auth.guard';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';

@ApiTags('Transactions Management')
@ApiBearerAuth()
@UseGuards(ClientGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly pointService: IPointService) {}

  @Post('bulk.add')
  async addBulkPoints(
    @GetClient() client: Staff,
    @Body() data: UpdatePointDTO[],
  ): Promise<OTransaction[]> {
    return TransactionFactory.getTransactions(await this.pointService.addBulk(client, data));
  }

  @Post('bulk.deduct')
  async deductBulkPoints(
    @GetClient() client: Staff,
    @Body() data: UpdatePointDTO[],
  ): Promise<OTransaction[]> {
    return TransactionFactory.getTransactions(await this.pointService.deductBulk(client, data));
  }

  @ApiOperation({ summary: 'Abonnner un client à une prestation de service' })
  @ApiResponse({
    status: 201,
    description: 'Points ajoutés avec succès',
    type: DocStaffDTO,
  })
  @Post('subscribe')
  async subscribe(
    @GetClient() client: Staff,
    @Body() data: PayAnnonceDTO,
  ): Promise<OStaff> {
    return StaffFactory.getClient(await this.pointService.subscribe(client, data));
  }

  @ApiOperation({ summary: 'Révoquer un abonnement' })
  @ApiResponse({
    status: 200,
    description: 'Révocation réussie',
    type: DocTransactionDTO,
  })
  @Post('revoke')
  async deductPoints(
    @GetClient() client: Staff,
    @Body() data: UpdatePointDTO,
  ): Promise<OTransaction> {
    return TransactionFactory.getTransaction(await this.pointService.revoke(client, { ...data, clientID: client.id }));
  }

  @ApiOperation({ summary: 'Obtenir l’historique des transactions des abonnements' })
  @ApiResponse({
    status: 200,
    description: 'Historique des transactions récupéré',
    isArray: true,
    type: DocTransactionDTO,
  })
  @Get('history')
  async getTransactionHistory(
    @GetClient() client: Staff,
  ): Promise<OTransaction[]> {
    if (!client.id) return [];
    const transactions = await this.pointService.fetchAll(client.id);
    return TransactionFactory.getTransactions(transactions);
  }

  @ApiOperation({ summary: 'Obtenir le solde actuel de points du client' })
  @ApiParam({
    name: 'clientID',
    description: 'ID du client non marchand',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Solde de points récupéré',
    type: Number,
  })
  @Get('balance')
  async getCurrentPoints(
    @GetClient() client: Staff,
    // @Param('clientID', ParseUUIDPipe) clientID: string,
  ): Promise<Partial<Staff | undefined>> {
    if (client) {
      return {
        points: client.points,
        bonus: client.bonus,
      }
    }
    // return this.pointService.getCurrentPoints(client.id);
  }
}
