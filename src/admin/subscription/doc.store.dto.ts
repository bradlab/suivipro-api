import { ApiProperty } from '@nestjs/swagger';
import { OSubscription } from '../_shared/model/subscription.model';
import { PositionDTO } from '../../_shared/adapter/param.dto';
import { IPosition } from '../../_shared/domain/interface';
import { OStaff } from '../_shared/model/staff.model';
import { DocStaffDTO } from 'admin/manager/doc.staff.dto';

export class DocStoreDTO implements Partial<OSubscription> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'name' })
  name: string;

  @ApiProperty({ type: String, name: 'address' })
  address: string;

  @ApiProperty({ type: PositionDTO, name: 'gps' })
  gps?: IPosition;

  @ApiProperty({ type: Boolean, name: 'isDefault' })
  isDefault: boolean;

  @ApiProperty({ type: DocStaffDTO, name: 'client' })
  client: OStaff;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
