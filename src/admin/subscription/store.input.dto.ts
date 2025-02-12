// /src/annonces/dto/create-annonce.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ICreateStoreDTO } from './store.service.interface';
import { IPosition } from '../../_shared/domain/interface';
import { PositionDTO } from '../../_shared/adapter/param.dto';
import { Type } from 'class-transformer';

export class CreateStoreDTO implements ICreateStoreDTO {
  @ApiProperty({ type: String, name: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: PositionDTO, name: 'gps', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PositionDTO)
  gps?: IPosition;

  @ApiProperty({ type: String, name: 'description', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, name: 'address', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateStoreDTO extends PartialType(CreateStoreDTO) {
  id: string;
}
