import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BeanService } from 'src/services/admin_bean.service';
import { Bean } from 'src/models/beanDto';

@ApiTags('Bean of the Day')
@Controller('botd')
export class BotdController {
  constructor(private readonly beanService: BeanService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current Bean of the Day' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved Bean of the Day',
    type: Bean,
  })
  @ApiResponse({ status: 404, description: 'No Bean of the Day found' })
  async getBotd() {
    return this.beanService.getBotd();
  }
}
