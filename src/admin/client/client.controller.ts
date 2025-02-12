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
  ClientAccoutDTO,
  ClientQuerDTO,
  RegisterClientDTO,
  UpdateClientDTO,
  UpdateUsernameDTO,
} from './client.input.dto';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { DocClientDTO } from './doc.client.dto';
import { GetClient } from '../_shared/decorator';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';
import { OClient } from 'admin/_shared/model/client.model';
import { ClientFactory } from 'admin/_shared/factory/client.factory';

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
    return clients.map((client) => ClientFactory.getClient(client, false));
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
      return ClientFactory.getClient(
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
    return ClientFactory.getClient(await this.clientService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @Post()
  // @HasPermission(RuleEnum.CAN_CREATE_CLIENT)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account client',
    description:
      'Créé un client B2B',
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
    @Body() data: ClientAccoutDTO,
    @UploadedFile() file: any,
  ): Promise<OStaff> {
    data.logo = file ? file.filename : undefined;
    const client = await this.clientService.add(data);
    return ClientFactory.getClient(client);
  }

    @Post('bulk')
    @ApiOperation({ summary: 'Créer une liste de clients' })
    @ApiResponse({
      status: 200,
      description: "clients créés avec succès",
      type: DocClientDTO,
    })
    async bulk(
      @GetClient() client: Staff,
      @Body() datas: ClientAccoutDTO[],
    ) {
      const prestations = await this.clientService.bulk(client, datas);
      return prestations?.map((prestation) => ClientFactory.getClient(prestation));
    }

  /**
   * @method PATCH
   */

  @Patch()
  // @HasPermission(RuleEnum.CAN_UPDATE_CLIENT)
  @ApiOperation({ summary: 'Update client account' })
  @ApiBody({ type: UpdateClientDTO })
  @ApiResponse({ type: DocClientDTO })
  async update(@Body() data: UpdateClientDTO): Promise<OClient> {
    return ClientFactory.getClient(await this.clientService.edit(data));
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
