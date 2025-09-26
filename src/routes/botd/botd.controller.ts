import { Controller, Get } from '@nestjs/common';
import { BeanService } from 'src/services/admin_bean.service';

@Controller('botd')
export class BotdController {
    constructor(private readonly beanService: BeanService) {}

    @Get()
    async getBotd() {
        return this.beanService.getBotd();
    }
}
