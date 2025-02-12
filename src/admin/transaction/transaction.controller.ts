import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocTransactionDTO } from './doc.transaction.dto';
import { SubscribeClientDTO, SubscriptionQuery } from './transaction.input.dto';
import { OTransaction } from '../_shared/model/transaction.model';
import { ITransactionService } from './transaction.service.interface';
import { GetClient } from '../_shared/decorator';
import { Staff } from '../_shared/model/staff.model';
import { TransactionFactory } from 'admin/_shared/factory/transaction.factory';
import { StaffGuard } from 'admin/_shared/guard/auth.guard';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';
import { SubscriptionFactory } from 'admin/_shared/factory/subscription.factory';
import { IDParamDTO } from 'adapter/param.dto';
import { OSubscription } from 'admin/_shared/model/subscription.model';

@ApiTags('Transactions Management')
@ApiBearerAuth()
@UseGuards(StaffGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: ITransactionService) {}

  @ApiOperation({ summary: 'Obtenir l’historique des transactions des abonnements' })
  @ApiResponse({
    status: 200,
    description: 'Historique des transactions récupéré',
    isArray: true,
    type: DocTransactionDTO,
  })
  @Get()
  async getAll(
    @GetClient() user: Staff,
    @Query() param: SubscriptionQuery
  ): Promise<OTransaction[]> {
    const transactions = await this.transactionService.fetchAll(param);
    return TransactionFactory.getTransactions(transactions);
  }

  @Post('bulk.subscription')
  async addBulkPoints(
    @GetClient() user: Staff,
    @Body() data: SubscribeClientDTO[],
  ): Promise<OTransaction[]> {
    return TransactionFactory.getTransactions(await this.transactionService.bulk(user, data));
  }

  @Post('renew.subscription')
  async deductBulkPoints(
    @GetClient() user: Staff,
    @Body() data: SubscribeClientDTO,
  ): Promise<OTransaction> {
    return TransactionFactory.getTransaction(await this.transactionService.renewSubscription(user, data));
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
  ): Promise<OSubscription> {
    return SubscriptionFactory.getSubscription(await this.transactionService.subscribe(client, data));
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
    return SubscriptionFactory.getSubscription(await this.transactionService.revoke(client, { subscriptionID: id }));
  }
}
