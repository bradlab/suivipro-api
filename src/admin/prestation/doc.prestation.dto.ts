import { ApiProperty } from '@nestjs/swagger';
import { OPrestation } from '../_shared/model/prestation.model';

export class DocPrestationDTO implements Partial<OPrestation> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'name', required: false })
  name?: string;

  @ApiProperty({ type: String, name: 'description', required: false })
  description?: string;

  @ApiProperty({ type: Number, name: 'price' })
  price: number;

  @ApiProperty({ type: Number, name: 'nbrSubscription' })
  nbrSubscription: number;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
