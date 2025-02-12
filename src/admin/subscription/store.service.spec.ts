// /src/annonces/annonce.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { StoreService } from './store.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ICreateStoreDTO } from './store.service.interface';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { CLIENT_MODEL_DATA, STORE_DATA } from '../../../test/test.data.spec';
import { Staff } from '../_shared/model/staff.model';

describe('AnnonceService', () => {
  let service: StoreService;
  let marketRepository: IDashboardRepository;

  const data: ICreateStoreDTO = STORE_DATA;
  const client = CLIENT_MODEL_DATA as Staff;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    marketRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should throw conflict exception if duplicate annonce exists', async () => {
    jest
      .spyOn(marketRepository.prestations, 'findOne')
      .mockResolvedValueOnce({} as any);

    await expect(service.add(client, data)).rejects.toThrow(ConflictException);
  });

  it('should throw not found exception when client does not exist', async () => {
    jest.spyOn(marketRepository.users, 'findOne').mockResolvedValueOnce({} as any);

    await expect(service.add(client, data)).rejects.toThrow(NotFoundException);
  });

  it('should add a new annonce if no duplicate exists and client exists', async () => {
    jest.spyOn(marketRepository.prestations, 'findOne').mockResolvedValueOnce({} as any);
    jest
      .spyOn(marketRepository.users, 'findOne')
      .mockResolvedValueOnce({} as any);
    await service.add(client, data);
    expect(marketRepository.prestations.create).toHaveBeenCalledWith(
      expect.objectContaining(data),
    );
  });
});
