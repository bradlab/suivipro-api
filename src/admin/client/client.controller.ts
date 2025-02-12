import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { DataGenerator } from 'domain/generator/data.generator';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { IClientService } from './client.service.interface';
import {
  ClientQuerDTO,
  RegisterClientDTO,
  UpdateClientDTO,
  UpdateUsernameDTO,
} from './client.input.dto';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { StaffFactory } from '../_shared/factory/staff.factory';
import { DocClientDTO } from './doc.client.dto';
import { GetClient } from '../_shared/decorator';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';

@ApiTags('Client as user management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: IClientService) {}

  // @HasPermission(RuleEnum.CAN_SHOW_CLIENT_LIST)
  @Get()
  @ApiOperation({
    summary: 'Clients list',
    description: 'Fetch all clients in the DB',
  })
  @ApiResponse({ type: DocClientDTO, isArray: true })
  async all(@Query() param: ClientQuerDTO): Promise<OStaff[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    const clients = await this.clientService.fetchAll(param);
    return clients.map((client) => StaffFactory.getClient(client));
  }

  // @HasPermission(RuleEnum.CAN_SHOW_CLIENT)
  @Get('search')
  @ApiOperation({
    summary: 'Single account',
    description: 'Fetch the client account by some of its informations',
  })
  @ApiQuery({
    type: String,
    name: 'email',
    description: 'email of the auth client',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'phone',
    description: 'phone number of the auth client',
    required: false,
  })
  @ApiResponse({ type: DocClientDTO })
  async search(@Query() param: ClientQuerDTO): Promise<OStaff | undefined> {
    if (param) {
      return StaffFactory.getClient(
        await this.clientService.search(param, undefined),
      );
    }
  }

  // @HasPermission(RuleEnum.CAN_SHOW_CLIENT)
  @Get(':id')
  @ApiOperation({
    summary: 'One Client',
    description: 'Fetch client account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocClientDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OStaff> {
    return StaffFactory.getClient(await this.clientService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @ApiExcludeEndpoint()
  @Post()
  // @HasPermission(RuleEnum.CAN_CREATE_CLIENT)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account client',
    description:
      'As a partner of the project, you can create client as employee for your business',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  async create(
    @Body() data: RegisterClientDTO,
    @UploadedFile() file: any,
  ): Promise<OStaff | undefined> {
    data.avatar = file ? file.filename : undefined;
    data.password = DataGenerator.randomString();
    const client = await this.clientService.add(data);
    if (client)
      return { ...StaffFactory.getClient(client), password: data.password };
  }

  /**
   * @method PATCH
   */

  @Patch('clientname')
  // @HasPermission(RuleEnum.CAN_UPDATE_CLIENT_PROFILE)
  @ApiOperation({
    summary: 'Update client credentials',
    description:
      "Modifier le mail et le numéro de téléphone de l'utilisateur. Cette action devra le déconnecter après",
  })
  @ApiResponse({ type: DocClientDTO })
  async credentials(
    @GetClient() client: Staff,
    @Body() data: UpdateUsernameDTO,
  ): Promise<boolean> {
    return await this.clientService.editCredential(client, data);
  }

  @Patch()
  // @HasPermission(RuleEnum.CAN_UPDATE_CLIENT)
  @ApiOperation({ summary: 'Update client account' })
  @ApiBody({ type: UpdateClientDTO })
  @ApiResponse({ type: DocClientDTO })
  async update(@Body() data: UpdateClientDTO): Promise<OStaff> {
    return StaffFactory.getClient(await this.clientService.edit(data));
  }

  @Patch('state')
  // @HasPermission(RuleEnum.CAN_SET_CLIENT_STATE)
  @ApiOperation({ summary: "Modification d'état des utilisateurs" })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des utilisateurs concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.clientService.setState(ids);
    }
    return false;
  }

  /**
   * @method DELETE
   */

  @ApiExcludeEndpoint()
  @Delete('clean')
  // @HasPermission(RuleEnum.CAN_DELETE_CLIENT)
  @ApiOperation({ summary: 'Clean removed Accounts' })
  @ApiResponse({ type: Boolean })
  clean(): Promise<boolean> {
    return this.clientService.clean();
  }

  @Delete(':id')
  // @HasPermission(RuleEnum.CAN_DELETE_CLIENT)
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the client to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.clientService.remove(id);
  }
}
