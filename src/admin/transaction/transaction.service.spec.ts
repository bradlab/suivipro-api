// /src/annonces/annonce.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ISubscribePrestation } from './transaction.service.interface';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { Staff } from '../_shared/model/staff.model';
import { CLIENT_MODEL_DATA, POINT_DATA } from '../../../test/test.data.spec';

describe('TransactionService', () => {
  let service: TransactionService;
  let marketRepository: IDashboardRepository;

  const data: ISubscribePrestation = POINT_DATA;
  const client = CLIENT_MODEL_DATA as Staff;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    marketRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should throw conflict exception if duplicate annonce exists', async () => {
    jest
      .spyOn(marketRepository.prestations, 'findOne')
      .mockResolvedValueOnce({} as any);

    await expect(service.renewSubscription(client, data)).rejects.toThrow(ConflictException);
  });

  it('should throw not found exception when client does not exist', async () => {
    jest.spyOn(marketRepository.users, 'findOne').mockResolvedValueOnce(null as any);

    await expect(service.renewSubscription(client, data)).rejects.toThrow(NotFoundException);
  });

  it('should add a new annonce if no duplicate exists and client exists', async () => {
    jest.spyOn(marketRepository.prestations, 'findOne').mockResolvedValueOnce(null as any);
    jest
      .spyOn(marketRepository.users, 'findOne')
      .mockResolvedValueOnce({} as any);
    await service.renewSubscription(client, data);
    expect(marketRepository.prestations.create).toHaveBeenCalledWith(
      expect.objectContaining(data),
    );
  });
});
