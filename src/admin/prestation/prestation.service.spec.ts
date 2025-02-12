// /src/annonces/annonce.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PrestationService } from './prestation.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ICreatePrestationDTO } from './prestation.service.interface';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { ANNONCE_DATA, CLIENT_MODEL_DATA } from '../../../test/test.data.spec';
import { Staff } from '../_shared/model/staff.model';

describe('PrestationService', () => {
  let service: PrestationService;
  let marketRepository: IDashboardRepository;

  const data: ICreatePrestationDTO = ANNONCE_DATA;
  const client = CLIENT_MODEL_DATA as Staff;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestationService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<PrestationService>(PrestationService);
    marketRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should throw conflict exception if duplicate annonce exists', async () => {
    jest
      .spyOn(marketRepository.prestations, 'findOne')
      .mockResolvedValueOnce({} as any);

    await expect(service.add(client, data)).rejects.toThrow(ConflictException);
  });

  it('should throw not found exception when client does not exist', async () => {
    jest.spyOn(marketRepository.users, 'findOne').mockResolvedValueOnce(null as any);

    await expect(service.add(client, data)).rejects.toThrow(NotFoundException);
  });

  it('should add a new annonce if no duplicate exists and client exists', async () => {
    jest.spyOn(marketRepository.prestations, 'findOne').mockResolvedValueOnce(null as any);
    jest
      .spyOn(marketRepository.users, 'findOne')
      .mockResolvedValueOnce({} as any);
    await service.add(client, data);
    expect(marketRepository.prestations.create).toHaveBeenCalledWith(
      expect.any(Object),
    );
  });
});
