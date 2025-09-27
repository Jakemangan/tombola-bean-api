import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Bean } from 'src/models/bean';
import { PostPutBeanDto } from 'src/models/postPutBeanDto';
import { BeanRepo } from 'src/repos/bean.repo';
import { BeanService } from 'src/services/admin_bean.service';

describe('BeanService', () => {
  let cut: BeanService;
  let beanRepo: jest.Mocked<BeanRepo>;

  const mockBean: Bean = {
    _id: '507f1f77bcf86cd799439011',
    index: 0,
    isBOTD: false,
    Cost: '£5.99',
    Image: 'https://example.com/bean-image.jpg',
    colour: 'Bean colour',
    Name: 'Big bean',
    Description: 'Some description',
    Country: 'Some country',
  };

  const mockPostBeanData: PostPutBeanDto = {
    Cost: '£7.99',
    Image: 'https://example.com/bean-image.jpg',
    colour: 'Bean colour',
    Name: 'New big bean',
    Description: 'Some description',
    Country: 'Some country',
  };

  const mockBeanRepo = {
    selectAllBeans: jest.fn(),
    insertBean: jest.fn(),
    updateBean: jest.fn(),
    deleteBean: jest.fn(),
    selectBotd: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeanService,
        {
          provide: BeanRepo,
          useValue: mockBeanRepo,
        },
      ],
    }).compile();

    cut = module.get<BeanService>(BeanService);
    beanRepo = module.get(BeanRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBeans', () => {
    it('should return an array of beans', async () => {
      const mockBeans: Bean[] = [mockBean];
      beanRepo.selectAllBeans.mockResolvedValue(mockBeans);

      const result = await cut.getBeans();

      expect(result).toEqual(mockBeans);
      expect(beanRepo.selectAllBeans).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no beans exist', async () => {
      beanRepo.selectAllBeans.mockResolvedValue([]);

      const result = await cut.getBeans();

      expect(result).toEqual([]);
      expect(beanRepo.selectAllBeans).toHaveBeenCalledTimes(1);
    });
  });

  describe('createBean', () => {
    it('should create a bean successfully', async () => {
      beanRepo.insertBean.mockResolvedValue(true);

      const result = await cut.createBean(mockPostBeanData);

      expect(result).toBe(true);
      expect(beanRepo.insertBean).toHaveBeenCalledWith(mockPostBeanData);
      expect(beanRepo.insertBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when bean creation fails', async () => {
      beanRepo.insertBean.mockResolvedValue(false);

      await expect(cut.createBean(mockPostBeanData)).rejects.toThrow(
        'Failed to insert bean',
      );
      expect(beanRepo.insertBean).toHaveBeenCalledWith(mockPostBeanData);
      expect(beanRepo.insertBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository throws error', async () => {
      const errorMessage = 'Database connection failed';
      beanRepo.insertBean.mockRejectedValue(new Error(errorMessage));

      await expect(cut.createBean(mockPostBeanData)).rejects.toThrow(
        errorMessage,
      );
      expect(beanRepo.insertBean).toHaveBeenCalledWith(mockPostBeanData);
      expect(beanRepo.insertBean).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateBean', () => {
    const beanId = '507f1f77bcf86cd799439011';

    it('should update a bean successfully', async () => {
      beanRepo.updateBean.mockResolvedValue(true);

      const result = await cut.updateBean(beanId, mockPostBeanData);

      expect(result).toBe(true);
      expect(beanRepo.updateBean).toHaveBeenCalledWith(
        beanId,
        mockPostBeanData,
      );
      expect(beanRepo.updateBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when bean update fails', async () => {
      beanRepo.updateBean.mockResolvedValue(false);

      await expect(cut.updateBean(beanId, mockPostBeanData)).rejects.toThrow(
        'Failed to update bean',
      );
      expect(beanRepo.updateBean).toHaveBeenCalledWith(
        beanId,
        mockPostBeanData,
      );
      expect(beanRepo.updateBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository throws error', async () => {
      const errorMessage = 'Bean not found';
      beanRepo.updateBean.mockRejectedValue(new Error(errorMessage));

      await expect(cut.updateBean(beanId, mockPostBeanData)).rejects.toThrow(
        errorMessage,
      );
      expect(beanRepo.updateBean).toHaveBeenCalledWith(
        beanId,
        mockPostBeanData,
      );
      expect(beanRepo.updateBean).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteBean', () => {
    const beanId = '507f1f77bcf86cd799439011';

    it('should delete a bean successfully', async () => {
      beanRepo.deleteBean.mockResolvedValue(true);

      const result = await cut.deleteBean(beanId);

      expect(result).toBe(true);
      expect(beanRepo.deleteBean).toHaveBeenCalledWith(beanId);
      expect(beanRepo.deleteBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when bean deletion fails', async () => {
      beanRepo.deleteBean.mockResolvedValue(false);

      await expect(cut.deleteBean(beanId)).rejects.toThrow(
        'Failed to delete bean',
      );
      expect(beanRepo.deleteBean).toHaveBeenCalledWith(beanId);
      expect(beanRepo.deleteBean).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository throws error', async () => {
      const errorMessage = 'Bean not found';
      beanRepo.deleteBean.mockRejectedValue(new Error(errorMessage));

      await expect(cut.deleteBean(beanId)).rejects.toThrow(errorMessage);
      expect(beanRepo.deleteBean).toHaveBeenCalledWith(beanId);
      expect(beanRepo.deleteBean).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBotd', () => {
    it('should return the bean of the day', async () => {
      const mockBotd: Bean = { ...mockBean, isBOTD: true };
      beanRepo.selectBotd.mockResolvedValue(mockBotd);

      const result = await cut.getBotd();

      expect(result).toEqual(mockBotd);
      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when no bean of the day exists', async () => {
      beanRepo.selectBotd.mockResolvedValue(undefined);

      await expect(cut.getBotd()).rejects.toThrow(NotFoundException);
      await expect(cut.getBotd()).rejects.toThrow('No Bean of the Day found');
      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when repository returns null', async () => {
      beanRepo.selectBotd.mockResolvedValue(undefined);

      await expect(cut.getBotd()).rejects.toThrow(NotFoundException);
      await expect(cut.getBotd()).rejects.toThrow('No Bean of the Day found');
      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(2);
    });

    it('should propagate repository errors', async () => {
      const errorMessage = 'Database connection failed';
      beanRepo.selectBotd.mockRejectedValue(new Error(errorMessage));

      await expect(cut.getBotd()).rejects.toThrow(errorMessage);
      expect(beanRepo.selectBotd).toHaveBeenCalledTimes(1);
    });
  });
});
