import { Test, TestingModule } from '@nestjs/testing';
import { Bean } from 'src/models/bean';
import { BeanRepo } from 'src/repos/bean.repo';
import { SearchService } from 'src/services/search.service';

describe('SearchService', () => {
  let service: SearchService;
  let beanRepo: jest.Mocked<BeanRepo>;

  const mockBeanRepo = {
    searchBeans: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: BeanRepo,
          useValue: mockBeanRepo,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    beanRepo = module.get(BeanRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search beans with given criteria and value', async () => {
    const mockBeans: Bean[] = [
      {
        _id: '507f1f77bcf86cd799439011',
        index: 0,
        isBOTD: false,
        Cost: '£5.99',
        Image: 'https://example.com/bean-image.jpg',
        colour: 'Bean colour',
        Name: 'Big bean',
        Description: 'Some description',
        Country: 'Some country',
      },
    ];

    beanRepo.searchBeans.mockResolvedValue(mockBeans);

    const result = await service.searchBeans('colour', 'red');

    expect(beanRepo.searchBeans).toHaveBeenCalledWith('colour', 'red');
    expect(result).toEqual(mockBeans);
  });
});
