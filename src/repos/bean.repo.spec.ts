import { Test, TestingModule } from '@nestjs/testing';
import { BeanRepo } from './bean.repo';

describe('BeanRepoService', () => {
  let service: BeanRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeanRepo],
    }).compile();

    service = module.get<BeanRepo>(BeanRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
