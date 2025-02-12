import { ApiProperty } from '@nestjs/swagger';
import { OStaff } from '../_shared/model/staff.model';
import { OPrestation } from '../_shared/model/annonce.model';

export class DocPrestationDTO implements Partial<OPrestation> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'title', required: false })
  title?: string;

  @ApiProperty({ type: String, name: 'description', required: false })
  description?: string;

  @ApiProperty({ type: Number, name: 'points' })
  points: number;

  @ApiProperty({ type: String, name: 'tags' })
  tags: string[];

  @ApiProperty({ type: Number, name: 'price' })
  price: number;

  @ApiProperty({ type: Number, name: 'quantity' })
  quantity: number;

  @ApiProperty({ type: DocPrestationDTO, name: 'client', required: false })
  user: OStaff;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
