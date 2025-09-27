import { Injectable } from '@nestjs/common';
import { BeanRepo } from '../repos/bean.repo';
import { Bean } from '../models/bean';

@Injectable()
export class SearchService {
  constructor(private readonly beanRepo: BeanRepo) {}

  async searchBeans(criteria: string, value: string): Promise<Bean[]> {
    return this.beanRepo.searchBeans(criteria, value);
  }
}
