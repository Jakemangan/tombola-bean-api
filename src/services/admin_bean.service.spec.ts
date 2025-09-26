import { Test, TestingModule } from '@nestjs/testing';
import { BeanService } from './admin_bean.service';

describe('AdminService', () => {
  let service: BeanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeanService],
    }).compile();

    service = module.get<BeanService>(BeanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
