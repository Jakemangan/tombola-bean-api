import { Injectable, NotFoundException } from '@nestjs/common';
import { Bean } from 'src/models/bean';
import { PostPutBeanDto } from 'src/models/postPutBeanDto';
import { BeanRepo } from 'src/repos/bean.repo';

@Injectable()
export class BeanService {
  constructor(private readonly beanRepo: BeanRepo) {}

  async getBeans(): Promise<Bean[]> {
    return this.beanRepo.selectAllBeans();
  }

  async createBean(beanData: PostPutBeanDto): Promise<boolean> {
    const res = await this.beanRepo.insertBean(beanData);
    if (!res) {
      throw new Error('Failed to insert bean');
    }
    return res;
  }

  async updateBean(id: string, beanData: PostPutBeanDto): Promise<boolean> {
    const res = await this.beanRepo.updateBean(id, beanData);
    if (!res) {
      throw new Error('Failed to update bean');
    }
    return res;
  }

  async deleteBean(id: string): Promise<boolean> {
    const res = await this.beanRepo.deleteBean(id);
    if (!res) {
      throw new Error('Failed to delete bean');
    }
    return res;
  }

  async getBotd(): Promise<Bean> {
    const botd = await this.beanRepo.selectBotd();
    if (!botd) {
      throw new NotFoundException('No Bean of the Day found');
    }
    return botd;
  }
}
