import { Test, TestingModule } from '@nestjs/testing';
import { BotdController } from './botd.controller';

describe('BotdController', () => {
  let controller: BotdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotdController],
    }).compile();

    controller = module.get<BotdController>(BotdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
