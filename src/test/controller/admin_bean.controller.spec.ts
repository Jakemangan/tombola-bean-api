import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BeanRepo } from 'src/repos/bean.repo';
import { AdminBeanController } from 'src/routes/admin_bean.controller';
import { BeanService } from 'src/services/admin_bean.service';

describe('AdminController', () => {
  let controller: AdminBeanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBeanController],
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
          provide: BeanService,
          useValue: {
            getBeans: jest.fn(),
            createBean: jest.fn(),
            updateBean: jest.fn(),
            deleteBean: jest.fn(),
            getBotd: jest.fn(),
          },
        },
        {
          provide: BeanRepo,
          useValue: {
            selectAllBeans: jest.fn(),
            insertBean: jest.fn(),
            updateBean: jest.fn(),
            deleteBean: jest.fn(),
            selectBotd: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminBeanController>(AdminBeanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
