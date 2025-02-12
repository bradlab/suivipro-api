// /src/annonces/dto/create-annonce.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IPrestationQuery, ICreatePrestationDTO } from './prestation.service.interface';

export class CreatePrestationDTO implements ICreatePrestationDTO {

  @ApiProperty({ name: 'name', description: "Nom de la prestation ou APP" })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'images',
    format: 'binary',
    isArray: true,
    description: 'Images de prévisualisation',
    required: false,
  })
  images: string[];

  @ApiProperty({
    name: 'description',
    description: "Description de la prestation",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ name: 'price' })
  @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  price: number;
}

export class UpdateAnnonceDTO extends PartialType(CreatePrestationDTO) {
  @ApiProperty({ name: 'id' })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({type: String, isArray: true, name: "keptImages", description: "The images maintained after modification or delete the list", required: false})
  @IsOptional()
  // @IsArray({each: true})
  keptImages?: string[];
}

export class PrestationQuery implements IPrestationQuery {
  @ApiProperty({ name: 'id', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @ApiProperty({ name: 'subscriptionID', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  subscriptionID?: string;

  @ApiProperty({ name: 'clientID', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  clientID?: string;

  @ApiProperty({ name: 'price', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiProperty({ name: 'name', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
