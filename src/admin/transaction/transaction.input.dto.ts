// /src/points/dto/point.input.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
import { SubscriptionTypeEnum } from '../_shared/model/transaction.model';
import { ISubscribePrestation, ISubscriptionQuery } from './transaction.service.interface';

export class SubscribeClientDTO implements ISubscribePrestation {

  @ApiProperty({
    name: "type",
    type: String,
    description: "Type de l'abonnement",
    enum: SubscriptionTypeEnum,
  })
  @IsString()
  @IsEnum(SubscriptionTypeEnum)
  type: SubscriptionTypeEnum;

  @ApiProperty({
    name: "clientID",
    description: "ID du client souscripteur",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  clientID?: string;

  @ApiProperty({
    name: "prestationID",
    description: "ID de la prestation concernée",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  prestationID?: string;
}

export class SubscriptionQuery extends PartialType(SubscribeClientDTO) implements ISubscriptionQuery {

  @ApiProperty({
    name: "transactionID",
    description: "ID de la transaction",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  transactionID?: string;

  @ApiProperty({
    name: "subscriptionID",
    description: "ID de la prestation concernée",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  subscriptionID?: string;
}
