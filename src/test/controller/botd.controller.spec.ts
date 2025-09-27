import { Test, TestingModule } from '@nestjs/testing';
import { BotdController } from 'src/routes/botd.controller';
import { BeanService } from 'src/services/admin_bean.service';

describe('BotdController', () => {
  let controller: BotdController;

  const mockBeanService = {
    getBotd: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotdController],
      providers: [
        {
          provide: BeanService,
          useValue: mockBeanService,
        },
      ],
    }).compile();

    controller = module.get<BotdController>(BotdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
