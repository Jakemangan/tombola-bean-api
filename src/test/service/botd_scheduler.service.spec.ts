import { BeanRepo } from 'src/repos/bean.repo';
import { BotdSchedulerService } from 'src/services/botd.scheduler.service';
import { Bean } from 'src/models/bean';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('BotdScheduler', () => {
  let cut: BotdSchedulerService;
  let beanRepo: jest.Mocked<BeanRepo>;
  let logger: jest.Mocked<Logger>;

  const mockBotd: Bean = {
    _id: '507f1f77bcf86cd799439011',
    index: 0,
    isBOTD: true,
    Cost: '',
    Image: '',
    colour: '',
    Name: 'Botd',
    Description: '',
    Country: '',
  };

  const mockNewBotd: Bean = {
    _id: '507f1f77bcf86cd799439011',
    index: 0,
    isBOTD: false,
    Cost: '',
    Image: '',
    colour: '',
    Name: 'New botd',
    Description: '',
    Country: '',
  };

  const mockBeanRepo = {
    selectAllBeans: jest.fn(),
    insertBean: jest.fn(),
    updateBean: jest.fn(),
    deleteBean: jest.fn(),
    selectBotd: jest.fn(),
    selectNonBotd: jest.fn(),
    updateBotd: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotdSchedulerService,
        {
          provide: BeanRepo,
          useValue: mockBeanRepo,
        },
      ],
    }).compile();

    cut = module.get<BotdSchedulerService>(BotdSchedulerService);
    beanRepo = module.get(BeanRepo);

    // Mock the logger
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    // Replace the logger instance in the service
    (cut as any).logger = logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduler', () => {
    it('should select a new botd', async () => {
      beanRepo.selectBotd.mockResolvedValue(mockBotd);
      beanRepo.selectNonBotd.mockResolvedValue(mockNewBotd);

      await cut.selectDailyBotd();

      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.selectNonBotd).toHaveBeenCalledTimes(1);

      expect(beanRepo.updateBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.updateBotd).toHaveBeenCalledWith(mockNewBotd._id);
    });

    it('should log warning and not call updateBotd when selectNonBotd returns null', async () => {
      beanRepo.selectBotd.mockResolvedValue(mockBotd);
      beanRepo.selectNonBotd.mockResolvedValue(null as any);

      await cut.selectDailyBotd();

      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.selectNonBotd).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(
        'No candidate bean found for BOTD',
      );
      expect(beanRepo.updateBotd).not.toHaveBeenCalled();
    });

    it('should log error when selectBotd throws an exception', async () => {
      const error = new Error('Database connection failed');
      beanRepo.selectBotd.mockRejectedValue(error);

      await cut.selectDailyBotd();

      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to select daily BOTD',
        error,
      );
      expect(beanRepo.selectNonBotd).not.toHaveBeenCalled();
      expect(beanRepo.updateBotd).not.toHaveBeenCalled();
    });

    it('should log error when selectNonBotd throws an exception', async () => {
      const error = new Error('Database query failed');
      beanRepo.selectBotd.mockResolvedValue(mockBotd);
      beanRepo.selectNonBotd.mockRejectedValue(error);

      await cut.selectDailyBotd();

      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.selectNonBotd).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to select daily BOTD',
        error,
      );
      expect(beanRepo.updateBotd).not.toHaveBeenCalled();
    });

    it('should log error when updateBotd throws an exception', async () => {
      const error = new Error('Update operation failed');
      beanRepo.selectBotd.mockResolvedValue(mockBotd);
      beanRepo.selectNonBotd.mockResolvedValue(mockNewBotd);
      beanRepo.updateBotd.mockRejectedValue(error);

      await cut.selectDailyBotd();

      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.selectNonBotd).toHaveBeenCalledTimes(1);
      expect(beanRepo.updateBotd).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to select daily BOTD',
        error,
      );
    });
  });
});
