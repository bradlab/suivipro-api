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
import { ISubscribePrestation } from './point.service.interface';

export class SubscribeClientDTO implements ISubscribePrestation {

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
  prestationID?: string;
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
