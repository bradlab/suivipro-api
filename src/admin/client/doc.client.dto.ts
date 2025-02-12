import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { OClient } from 'admin/_shared/model/client.model';

export class DocClientDTO
  extends BasicPersonnalInfoDTO
  implements Partial<OClient>
{
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'matricule', required: false })
  matricule: string;

  @ApiProperty({ type: String, name: 'address' })
  address: string;

  @ApiProperty({ type: String, name: 'CNI', required: false })
  CNI: string;

  @ApiProperty({ type: String, name: 'NIF', required: false })
  NIF: string;

  @ApiProperty({ type: String, name: 'country' })
  country: string;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Number, name: 'nbrSubscription' })
  nbrSubscription: number;
  
  @ApiProperty({ type: Number, name: 'nbrTransaction' })
  nbrTransaction: number;

  @ApiProperty({
    type: String,
    name: 'fullname',
    description: "Raison de l'entreprise s'il s'agit",
  })
  fullname: string;
  
  @ApiProperty({
    type: String,
    name: 'phone',
    description:
      "Le numéro de téléphone sur lequel contacter l'utilisateur du compte ou envoyer des informations OTP",
  })
  phone: string;

  @ApiProperty({
    type: String,
    name: 'email',
    description:
      "L'adresse e-mail sur laquelle partagent certaines informations avec l'utilisateur par notification",
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: String,
    name: 'logo',
    description: 'Logo du client',
    required: false,
  })
  logo?: string;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}

export class DocSignedClientDTO extends DocClientDTO {
  @ApiProperty({ type: String, name: 'accessToken' })
  accessToken: string;
}
