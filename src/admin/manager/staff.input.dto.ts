import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IClientQuery } from 'admin/auth/auth.service.interface';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class StaffAccoutDTO extends BasicPersonnalInfoDTO {
  @ApiProperty({
    type: String,
    name: 'fullName',
    description: "Raison de l'entreprise s'il s'agit",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsString()
  fullName?: string;

  @ApiProperty({
    type: Boolean,
    name: 'isMerchant',
    required: false,
  })
  @IsOptional()
  // @ParseBoolean()
  // @IsBoolean()
  isMerchant?: boolean;

  avatar?: string;
}

export class RegisterStaffDTO extends StaffAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  password: string;
}

export class UpdateStaffDTO extends PartialType(StaffAccoutDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'ID of the given user',
  })
  @IsString()
  @IsUUID()
  id: string;
}
export class UpdateUsernameDTO extends PartialType(
  PickType(StaffAccoutDTO, ['email', 'phone']),
) {}

export class StaffQuerDTO implements IClientQuery {
  @ApiProperty({
    type: String,
    name: 'ids',
    isArray: true,
    description: 'Liste des ID des clients',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  ids: string[];

  @ApiProperty({
    type: String,
    name: 'email',
    description: 'email of the given user',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'phone number of the given user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
