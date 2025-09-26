import { Injectable } from '@nestjs/common';
import { Bean } from 'src/models/beanDto';
import { PostBeanRequestBody } from 'src/models/postBeanDto';
import { BeanRepo } from 'src/repos/bean.repo';

@Injectable()
export class BeanService {
  constructor(private readonly beanRepo: BeanRepo) {}

  async getBeans(): Promise<Bean[]> {
    return this.beanRepo.selectAllBeans();
  }

  async createBean(beanData: PostBeanRequestBody): Promise<boolean> {
    const res = await this.beanRepo.insertBean(beanData);
    if (!res) {
      throw new Error('Failed to insert bean');
    }
    return res;
  }

  async updateBean(
    id: string,
    beanData: PostBeanRequestBody,
  ): Promise<boolean> {
    const res = this.beanRepo.updateBean(id, beanData);
    if (!res) {
      throw new Error('Failed to update bean');
    }
    return res;
  }

  async deleteBean(id: string): Promise<boolean> {
    const res = this.beanRepo.deleteBean(id);
    if (!res) {
      throw new Error('Failed to delete bean');
    }
    return res;
  }

  async getBotd(): Promise<Bean> {
    const botd = await this.beanRepo.selectBotd();
    if (!botd) {
      throw new Error('No BOTD found');
    }
    return botd;
  }
}
