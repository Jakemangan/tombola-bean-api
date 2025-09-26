import { Test, TestingModule } from '@nestjs/testing';
import { AdminBeanController } from './admin_bean.controller';

describe('AdminController', () => {
  let controller: AdminBeanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBeanController],
    }).compile();

    controller = module.get<AdminBeanController>(AdminBeanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
