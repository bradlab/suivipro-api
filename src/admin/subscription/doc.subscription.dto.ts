import { ApiProperty } from '@nestjs/swagger';
import { OSubscription } from '../_shared/model/subscription.model';
import { OClient } from 'admin/_shared/model/client.model';
import { OPrestation } from 'admin/_shared/model/prestation.model';
import { DocClientDTO } from 'admin/client/doc.client.dto';
import { DocPrestationDTO } from 'admin/prestation/doc.prestation.dto';
import { SubscriptionTypeEnum } from 'admin/_shared/model/transaction.model';

export class DocSubscriptionDTO implements Partial<OSubscription> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: DocClientDTO, name: 'client' })
  client: OClient;

  @ApiProperty({ type: DocPrestationDTO, name: 'prestation' })
  prestation: OPrestation;

  @ApiProperty({
    name: "type",
    type: String,
    description: "Type d'abonnement",
    enum: SubscriptionTypeEnum,
  })
  type: SubscriptionTypeEnum;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'closedAt' })
  closedAt: Date;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
