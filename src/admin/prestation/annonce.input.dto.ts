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

import { IAnnonceQuery, ICreateAnnonceDTO } from './annonce.service.interface';

export class CreateAnnonceDTO implements ICreateAnnonceDTO {
  @ApiProperty({ name: 'storeID', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  storeID: string;

  @ApiProperty({ name: 'title', description: "Titre de l'annonce" })
  @IsOptional()
  @IsString()
  title: string;

  // @ApiProperty({
  //   name: 'images',
  //   description: 'Images de prévisualisation',
  //   required: false,
  // })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // images?: string[];

  @ApiProperty({
    format: 'binary',
    name: 'images',
    description: 'Images de prévisualisation',
    required: false,
  })
  images: string[];

  @ApiProperty({
    name: 'description',
    description: "Description de l'annonce",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    name: 'quantity',
    description: 'Quantité de déchets plastiques',
  })
  @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  quantity: number;

  @ApiProperty({
    name: 'tags',
    description: "Tags associés à l'annonce",
    example: ['tuyaux', 'emballages'],
  })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ name: 'price', description: 'Prix des déchets plastiques' })
  @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  price: number;
}

export class UpdateAnnonceDTO extends PartialType(CreateAnnonceDTO) {
  @ApiProperty({ name: 'id' })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({type: String, isArray: true, name: "keptImages", description: "The images maintained after modification or delete the list", required: false})
  @IsOptional()
  // @IsArray({each: true})
  keptImages?: string[];
}

export class AnnonceQuery implements IAnnonceQuery {
  @ApiProperty({ name: 'id', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @ApiProperty({ name: 'storeID', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  storeID?: string;

  @ApiProperty({ name: 'tags', required: false })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ name: 'price', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiProperty({ name: 'quantity', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;
}
