import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BeanService } from '../../services/admin_bean.service';
import { PostBeanRequestBody } from 'src/models/postBeanDto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/bean')
export class AdminBeanController {
  constructor(private readonly beanService: BeanService) {}

  @Get()
  getAdmin() {
    return this.beanService.getBeans();
  }

  @Post()
  async postAdmin(@Body() bean: PostBeanRequestBody) {
    await this.beanService.createBean(bean);
    return { message: 'Bean created successfully' };
  }

  @Put(':id')
  async putAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() bean: PostBeanRequestBody,
  ) {
    await this.beanService.updateBean(String(id), bean);
    return { message: 'Bean updated successfully' };
  }

  @Delete(':id')
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.beanService.deleteBean(String(id));
    return { message: 'Bean deleted successfully' };
  }
}
