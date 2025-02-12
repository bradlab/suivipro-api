// /src/points/point.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocTransactionDTO } from './doc.transaction.dto';
import { PayAnnonceDTO, SubscribeClientDTO } from './point.input.dto';
import { OTransaction } from '../_shared/model/transaction.model';
import { ITransactionService } from './point.service.interface';
import { GetClient } from '../_shared/decorator';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { StaffFactory } from 'admin/_shared/factory/staff.factory';
import { TransactionFactory } from 'admin/_shared/factory/transaction.factory';
import { StaffGuard } from 'admin/_shared/guard/auth.guard';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';
import { OClient } from 'admin/_shared/model/client.model';
import { ClientFactory } from 'admin/_shared/factory/client.factory';
import { SubscriptionFactory } from 'admin/_shared/factory/subscription.factory';
import { IDParamDTO } from 'adapter/param.dto';
import { OSubscription } from 'admin/_shared/model/subscription.model';

@ApiTags('Transactions Management')
@ApiBearerAuth()
@UseGuards(StaffGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly pointService: ITransactionService) {}

  @Post('bulk.add')
  async addBulkPoints(
    @GetClient() client: Staff,
    @Body() data: SubscribeClientDTO[],
  ): Promise<OTransaction[]> {
    return TransactionFactory.getTransactions(await this.pointService.addBulk(client, data));
  }

  @Post('bulk.deduct')
  async deductBulkPoints(
    @GetClient() client: Staff,
    @Body() data: SubscribeClientDTO[],
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
    @Body() data: SubscribeClientDTO,
  ): Promise<OClient> {
    return ClientFactory.getClient(await this.pointService.subscribe(client, data));
  }

  @ApiOperation({ summary: 'Révoquer un abonnement' })
  @ApiResponse({
    status: 200,
    description: 'Révocation réussie',
    type: DocTransactionDTO,
  })
  @Post('revoke/:id')
  async deductPoints(
    @GetClient() client: Staff,
    @Param() {id}: IDParamDTO,
  ): Promise<OSubscription> {
    return SubscriptionFactory.getSubscription(await this.pointService.revoke(client, { subscriptionID: id }));
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
}
