import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SearchController } from 'src/routes/search.controller';
import { SearchService } from 'src/services/search.service';

describe('SearchController', () => {
  let controller: SearchController;

  const mockSearchService = {
    searchBeans: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_ISS: 'test-issuer',
                JWT_AUD: 'test-audience',
                JWT_KEY: 'test-key',
              };
              return config[key];
            }),
          },
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
