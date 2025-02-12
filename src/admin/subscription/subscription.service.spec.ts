// /src/subscriptions/subscription.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ICreateSubscriptionDTO } from './subscription.service.interface';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { CLIENT_MODEL_DATA, STORE_DATA } from '../../../test/test.data.spec';
import { Staff } from '../_shared/model/staff.model';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let dashboardRepository: IDashboardRepository;

  const data: ICreateSubscriptionDTO = STORE_DATA;
  const client = CLIENT_MODEL_DATA as Staff;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    dashboardRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should throw conflict exception if duplicate subscription exists', async () => {
    jest
      .spyOn(dashboardRepository.prestations, 'findOne')
      .mockResolvedValueOnce({} as any);

    await expect(service.add(client, data)).rejects.toThrow(ConflictException);
  });

  it('should throw not found exception when client does not exist', async () => {
    jest.spyOn(dashboardRepository.users, 'findOne').mockResolvedValueOnce({} as any);

    await expect(service.add(client, data)).rejects.toThrow(NotFoundException);
  });

  it('should add a new subscription if no duplicate exists and client exists', async () => {
    jest.spyOn(dashboardRepository.prestations, 'findOne').mockResolvedValueOnce({} as any);
    jest
      .spyOn(dashboardRepository.users, 'findOne')
      .mockResolvedValueOnce({} as any);
    await service.add(client, data);
    expect(dashboardRepository.prestations.create).toHaveBeenCalledWith(
      expect.objectContaining(data),
    );
  });
});
