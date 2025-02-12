import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { IStaffService } from 'admin/manager/staff.service.interface';
// import { RULES } from 'app/access.constant';

@Injectable()
export class GlobalSeed implements OnApplicationBootstrap {
  private logger = new Logger();
  constructor(
    private readonly adminService: IStaffService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createAdmin();
    await this.createAccess();
  }

  private async createAccess() {
    try {
      // const isOkay = await this.adminService.addBulk(RULES); // TODO: uncomment this line when you have permissions
      // if (isOkay) {
      //   this.logger.log('Permissions créés avec succès');
      // }
    } catch (error) {
      this.logger.log(error, 'CREATE::ACCESS => SEED');
    }
  }

    async createAdmin() {
      try {
        // const data: IRegisterClientDTO = {
        //   email: 'admin.test@gmail.com',
        //   password: 'admin1234',
        //   fullname: 'Admin Test',
        //   phone: '+228 93 14 14 14',
        //   address: 'Lomé, Togo',
        //   country: 'Togo',
        //   gps: { lat: 6.5244, lng: 3.3792 },
        // } 
        const data: IRegisterClientDTO = {
          email: 'admin.test@gmail.com',
          password: 'azerty10',
          firstname: 'Admin',
          lastname: 'First',
          fullname: 'Admin First',
          phone: '+228 93 14 14 14',
          address: 'Avenou, Lomé - Togo',
          country: 'Togo',
        }
        const staff = await this.adminService.add(data);
        console.log('ADMIN ===== STAFF', {email: staff?.email, pwd: data.password})
      } catch (error) {
        this.logger.error(error.message, 'ERROR::GlobalSeed.createAdmin');
      }
    }
}
