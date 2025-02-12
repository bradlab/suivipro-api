import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { ClientService } from './client.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TestGlobalConfig } from 'test/test-config.spec';
import { ClientController } from './client.controller';
import { SexEnum } from 'app/enum';
import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { IClientService } from './client.service.interface';
import { IDashboardRepository } from '../_shared/dashboard.repository';

describe('ClientController', () => {
  let controller: ClientController;
  let moduleRef: TestingModule;
  let repository: IDashboardRepository;

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const data: IRegisterClientDTO = {
    firstname: firstName,
    lastname: lastName,
    phone: faker.phone.number({ style: 'international' }),
    sex: faker.helpers.enumValue(SexEnum),
    email: faker.internet.email({ firstName, lastName }),
    password: faker.string.alphanumeric(8),
    address: faker.location.streetAddress(),
    country: faker.location.country(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      imports: [JwtModule],
      providers: [
        { provide: IClientService, useClass: ClientService },
        {
          provide: IDashboardRepository,
          useClass: jest.fn(() => TestGlobalConfig.mockDataService()),
        },
      ],
    }).compile();

    controller = moduleRef.get<ClientController>(ClientController);
    repository = moduleRef.get<IDashboardRepository>(IDashboardRepository);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Client Execptions', () => {
    it('should throw Conflict error on create', () => {
      const mockCreate = async () => {
        await controller.create(data, null as any);
      };
      void expect(mockCreate).rejects.toThrow(ConflictException);
    });

    it('should throw not found error on create', async () => {
      repository.users.findOne = jest.fn(() => undefined as any);
      const mockCreate = async () => {
        await controller.create(data, null as any);
      };
      await expect(mockCreate).rejects.toThrow(NotFoundException);
    });

    it('should throw not found error on edit', () => {
      const mockEdit = async () => {
        await controller.update({ ...data, id: undefined as any });
      };
      void expect(mockEdit).rejects.toThrow(NotFoundException);
    });

    it('should return false on remove', async () => {
      const resp = await controller.remove({ id: undefined as any });
      expect(resp).toBeFalsy();
    });
  });
});
