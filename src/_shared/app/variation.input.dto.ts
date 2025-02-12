import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductLineDTO implements Partial<IProductLineDTO> {
  @ApiProperty({
    type: String,
    name: 'id',
    description:
      'ID de la resource concernée (variation de produit, tarif de service ou pack)',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'Quantité de la resource concernée',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;
}

export class ProductLineRequiredDTO extends ProductLineDTO {
  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'Quantité de la resource concernée',
  })
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
export interface IProductLineDTO {
  quantity: number;
  id: string;
}
