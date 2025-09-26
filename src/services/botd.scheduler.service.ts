import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BeanRepo } from 'src/repos/bean.repo';

@Injectable()
export class BotdSchedulerService {
  private readonly logger = new Logger(BotdSchedulerService.name);

  constructor(private readonly beanRepo: BeanRepo) {}


  @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_DAY_AT_1AM) // This is the cron expression to be used for once a day, but for testing purposes this is set to every minute so the output of /botd will visibly change
  async selectDailyBotd(): Promise<void> {
    try {
      const current = await this.beanRepo.selectBotd();

      const newBotd = await this.beanRepo.selectNonBotd(current?._id ?? '');

      if (!newBotd) {
        this.logger.warn('No candidate bean found for BOTD');
        return;
      }

      await this.beanRepo.updateBotd(newBotd._id);
      this.logger.log(
        `New BOTD selected: ${newBotd.Name} (${newBotd._id})`,
      );
    } catch (err) {
      this.logger.error('Failed to select daily BOTD', err as Error);
    }
  }
}
