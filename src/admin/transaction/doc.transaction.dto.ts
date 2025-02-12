import { ApiProperty } from '@nestjs/swagger';
import { OStaff } from '../_shared/model/staff.model';
import {
  OTransaction,
  TransactionTypeEnum,
} from '../_shared/model/transaction.model';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';
import { OClient } from 'admin/_shared/model/client.model';
import { DocClientDTO } from 'admin/client/doc.client.dto';
import { OSubscription } from 'admin/_shared/model/subscription.model';
import { DocSubscriptionDTO } from 'admin/subscription/doc.subscription.dto';

export class DocTransactionDTO implements Partial<OTransaction> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: DocClientDTO, name: 'client', required: false })
  client: OClient;

  @ApiProperty({ type: DocSubscriptionDTO, name: 'client', required: false })
  subscription: OSubscription;

  @ApiProperty({ type: Number, name: 'points' })
  amount: number;

  @ApiProperty({ type: String, name: 'type' })
  type: TransactionTypeEnum;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
