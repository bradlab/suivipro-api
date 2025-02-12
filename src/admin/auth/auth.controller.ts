import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  NotImplementedException,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { GetClient } from '../_shared/decorator';
import { StaffFactory } from '../_shared/factory/staff.factory';
import { Staff, OStaff, SignedStaff } from '../_shared/model/staff.model';
import { IMarketAuthService } from './auth.service.interface';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SigninAccoutDTO,
  UpdatePwdDTO,
} from 'adapter/auth.dto';
import { RegisterClientDTO } from './auth.input.dto';
import { BaseConfig } from 'config/base.config';
import { Public } from 'adapter/decorator';
import { StaffGuard } from 'admin/_shared/guard/auth.guard';
import { DocSignedStaffDTO, DocStaffDTO } from 'admin/manager/doc.staff.dto';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: IMarketAuthService) {}

  @Public()
  @Get('check.email/:email')
  @ApiOperation({
    summary: 'Check email',
    description:
      'This endpoint allows to check if the email exist before register it',
  })
  @ApiParam({ type: String, name: 'email' })
  @ApiResponse({ type: Boolean })
  checkEmail(@Param('email') email: string): Promise<boolean> {
    return this.authService.checkEmail(email);
  }

  @Public()
  @Get('check.phone/:phone')
  @ApiOperation({
    summary: 'Check phone',
    description:
      'This endpoint allows to check if the phone exist before register it',
  })
  @ApiParam({ type: String, name: 'phone' })
  @ApiResponse({ type: Boolean })
  checkPhone(@Param('phone') phone: string): Promise<boolean> {
    return this.authService.checkPhone(phone);
  }

  @ApiBearerAuth()
  @UseGuards(StaffGuard)
  @Get('token.signin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token connexion' })
  @ApiResponse({ type: DocSignedStaffDTO })
  async signinByToken(@GetClient() client: Staff): Promise<OStaff> {
    return StaffFactory.getClient(client);
  }

  /**
   * @method POST
   */

  @Public()
  @Post('signup')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account client',
    description: 'Créé un compte utilisateur client',
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
  @ApiResponse({ type: DocStaffDTO })
  async create(
    @Body() data: RegisterClientDTO,
    @UploadedFile() file: any,
  ): Promise<SignedStaff> {
    data.avatar = file?.filename;
    const { accessToken, user } = await this.authService.signup(data);
    if (user) {
      return {
        accessToken,
        ...StaffFactory.getClient(user),
      };
    }
    throw new InternalServerErrorException('User not created');
  }

  @Post('signin')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'User connexion endpoint' })
  @ApiBody({ type: SigninAccoutDTO })
  @ApiResponse({ type: DocSignedStaffDTO })
  async signin(@Body() data: SigninAccoutDTO): Promise<SignedStaff> {
    const { accessToken, user } = await this.authService.signin(data);
    if (user) {
      return {
        accessToken,
        ...StaffFactory.getClient(user),
      };
    }
    throw new UnauthorizedException('User not found');
  }

  @Post('password.forgot')
  @ApiOperation({
    summary: 'Forgot password',
    description:
      "Ce endpoint permet à un utilisateur de notifier à un admin qu'il a oublié son mot de passe",
  })
  @ApiBody({ type: ForgotPasswordDTO })
  @ApiResponse({ type: String })
  async forgotPassword(@Body() data: ForgotPasswordDTO): Promise<string> {
    return await this.authService.forgotPassword(data);
  }

  @Post('password.reset')
  @ApiOperation({
    summary: 'Reset password',
    description: 'This endpoint allows the client to reset his password',
  })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({ type: Boolean })
  async resetPassword(@Body() data: ResetPasswordDTO): Promise<boolean> {
    return await this.authService.resetPassword({
      ...data,
      otpCode: data.otpCode?.toString(),
    });
  }

  @Patch('password.update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update password',
    description: 'This endpoint allows the client to update his password',
  })
  @ApiBody({ type: UpdatePwdDTO })
  @ApiResponse({ type: Boolean })
  async updatePassword(
    @GetClient() client: Staff,
    @Body() data: UpdatePwdDTO,
  ): Promise<boolean> {
    return await this.authService.updatePassword(client, data);
  }
}
