import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BeanService } from '../../services/admin_bean.service';
import { SearchService } from 'src/services/search.service';
import { SearchQueryDto } from 'src/models/searchQueryDto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(
    private readonly beanService: BeanService,
    private readonly searchService: SearchService,
  ) {}

  @Get()
  async searchBeans(@Body() searchQueryDto: SearchQueryDto) {
    if (!searchQueryDto.criteria || !searchQueryDto.value) {
      throw new BadRequestException(
        'Both criteria and value parameters are required',
      );
    }

    return this.searchService.searchBeans(searchQueryDto.criteria, searchQueryDto.value);
  }
}
