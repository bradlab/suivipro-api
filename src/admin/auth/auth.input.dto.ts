import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { BasicPersonnalInfoDTO, PositionDTO } from 'adapter/param.dto';
import { ParseBoolean } from '../../_shared/adapter/validation/custom.transformer';
import { IPosition } from '../../_shared/domain/interface';
import { Type } from 'class-transformer';
export class RegisterClientDTO extends BasicPersonnalInfoDTO {
  @ApiProperty({
    type: PositionDTO,
    name: 'gps',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PositionDTO)
  gps?: IPosition;

  @ApiProperty({
    type: String,
    name: 'username',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    name: 'isMerchant',
    required: false,
  })
  @IsOptional()
  // @ParseBoolean()
  // @IsBoolean()
  isMerchant: boolean;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'avatar',
    required: false,
  })
  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  avatar: string;
}
