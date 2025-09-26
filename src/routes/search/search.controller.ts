import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { BeanService } from '../../services/admin_bean.service';
import { SearchService } from 'src/services/search.service';
import { SearchQueryDto } from 'src/models/searchQueryDto';
import { Bean } from 'src/models/beanDto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('Bean Search')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({ summary: 'Search for beans by criteria' })
  @ApiBody({
    type: SearchQueryDto,
    description:
      'Search criteria and value. Criteria can be colour, name, or country',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully found matching beans',
    type: [Bean],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing criteria or value',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchBeans(@Body() searchQueryDto: SearchQueryDto) {
    if (!searchQueryDto.criteria || !searchQueryDto.value) {
      throw new BadRequestException(
        'Both criteria and value parameters are required',
      );
    }

    return this.searchService.searchBeans(
      searchQueryDto.criteria,
      searchQueryDto.value,
    );
  }
}
