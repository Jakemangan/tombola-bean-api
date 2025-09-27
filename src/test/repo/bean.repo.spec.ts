import { Test, TestingModule } from '@nestjs/testing';
import { BeanRepo } from 'src/repos/bean.repo';
import { SQLITE_DB } from 'src/util/constants';

describe('BeanRepoService', () => {
  let service: BeanRepo;

  const mockSqliteDb = {
    prepare: jest.fn(),
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeanRepo,
        {
          provide: SQLITE_DB,
          useValue: mockSqliteDb,
        },
      ],
    }).compile();

    service = module.get<BeanRepo>(BeanRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
