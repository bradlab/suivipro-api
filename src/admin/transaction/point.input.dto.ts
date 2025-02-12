// /src/points/dto/point.input.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  Min,
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
import { TransactionTypeEnum } from '../_shared/model/transaction.model';
import { IUpdatePointDTO } from './point.service.interface';

export class UpdatePointDTO implements IUpdatePointDTO {
  @ApiProperty({
    type: Number,
    description: 'Quantité de points à ajouter ou déduire',
  })
  @IsNumber()
  @Min(1, {
    message: 'La quantité de points doit être supérieure ou égale à 1',
  })
  points: number;

  @ApiProperty({
    type: String,
    description: 'Type de plastique',
    enum: TransactionTypeEnum,
  })
  @IsString()
  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @ApiProperty({
    description: "ID de l'annonce consultée",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  annonceID?: string;
}

export class PayAnnonceDTO {
  @ApiProperty({
    description: "ID de l'annonce consultée",
    type: String,
  })
  @IsString()
  @IsUUID()
  annonceID?: string;
}
