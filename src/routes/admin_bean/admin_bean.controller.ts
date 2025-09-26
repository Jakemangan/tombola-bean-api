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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BeanService } from '../../services/admin_bean.service';
import { PostBeanRequestBody } from 'src/models/postBeanDto';
import { Bean } from 'src/models/beanDto';
import { JwtAuthAdminGuard } from 'src/guards/jwtAdmin.guard';

@ApiTags('Admin Bean Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthAdminGuard)
@Controller('admin/bean')
export class AdminBeanController {
  constructor(private readonly beanService: BeanService) {}

  @Get()
  @ApiOperation({ summary: 'Get all beans' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all beans',
    type: [Bean],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAdmin() {
    return this.beanService.getBeans();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bean' })
  @ApiBody({ type: PostBeanRequestBody })
  @ApiResponse({
    status: 201,
    description: 'Bean created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bean created successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async postAdmin(@Body() bean: PostBeanRequestBody) {
    await this.beanService.createBean(bean);
    return { message: 'Bean created successfully' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a bean by ID' })
  @ApiParam({ name: 'id', description: 'Bean ID', type: 'number' })
  @ApiBody({ type: PostBeanRequestBody })
  @ApiResponse({
    status: 200,
    description: 'Bean updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bean updated successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bean not found' })
  async putAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() bean: PostBeanRequestBody,
  ) {
    await this.beanService.updateBean(String(id), bean);
    return { message: 'Bean updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bean by ID' })
  @ApiParam({ name: 'id', description: 'Bean ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Bean deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bean deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bean not found' })
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.beanService.deleteBean(String(id));
    return { message: 'Bean deleted successfully' };
  }
}
