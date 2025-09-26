import { Injectable } from '@nestjs/common';
import { Bean } from 'src/models/beanDto';
import { BeanRepo } from 'src/repos/bean.repo';

@Injectable()
export class SearchService {
  constructor(private readonly beanRepo: BeanRepo) {}

  async searchBeans(criteria: string, value: string): Promise<Bean[]> {
    return this.beanRepo.searchBeans(criteria, value);
  }
}
