import { ApiProperty } from '@nestjs/swagger';
import { OStaff } from '../_shared/model/staff.model';
import {
  OTransaction,
  TransactionTypeEnum,
} from '../_shared/model/transaction.model';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';

export class DocTransactionDTO implements Partial<OTransaction> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: DocStaffDTO, name: 'client', required: false })
  client: OStaff;

  @ApiProperty({ type: Number, name: 'points' })
  points: number;

  @ApiProperty({ type: String, name: 'type' })
  type: TransactionTypeEnum;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
