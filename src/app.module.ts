import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from 'better-sqlite3';
import type { Database as SqliteDb } from 'better-sqlite3';
import DBMigrate from 'db-migrate';
import path from 'path';
import fs from 'fs';
import { Bean } from './models/bean';
import { AdminBeanController } from './routes/admin_bean/admin_bean.controller';
import { BeanService } from './services/admin_bean.service';
import { SQLITE_DB } from './util/constants';
import { BeanRepo } from './repos/bean.repo';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BotdSchedulerService } from './services/botd.scheduler.service';
import { BotdController } from './routes/botd/botd.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  controllers: [AppController, AdminBeanController, BotdController],
  providers: [
    AppService,
    BotdSchedulerService,
    {
      provide: SQLITE_DB,
      useFactory: () => {
        const dbPath = 'db.sqlite';
        const db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        return db;
      },
    },
    {
      provide: 'SQLITE_DB_CLOSER',
      useFactory: (db: SqliteDb) => {
        return {
          close: () => {
            try {
              db.close();
            } catch {}
          },
        };
      },
      inject: [SQLITE_DB],
    },
    BeanService,
    BeanRepo,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(SQLITE_DB) private readonly sqliteDb: SqliteDb,
    @Inject('SQLITE_DB_CLOSER') private readonly closer: { close: () => void },
  ) {}

  async onModuleInit() {
    console.log('AppModule initialized');
    const dbMigrate = DBMigrate.getInstance(true, {
      config: 'database.json',
      env: 'dev',
    });
    await dbMigrate.up();

    console.log('DB migrations up to date');

    const repoRoot = path.resolve(__dirname, '..');
    const seedPath = path.resolve(repoRoot, 'seed.json');
    const seed = fs.readFileSync(seedPath, 'utf8');
    const seedData = JSON.parse(seed);
    const db = this.sqliteDb;

    const insert = db.prepare(`
      INSERT OR IGNORE INTO beans (
        _id, "index", isBOTD, Cost, Image, colour, Name, Description, Country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tx = db.transaction((rows: Bean[]) => {
      for (const r of rows) {
        const select = db.prepare('SELECT * FROM beans WHERE _id = ?');
        const existing = select.get(r._id);
        if (existing) {
          console.log(r.Name, 'already exists, not inserting into table');
          continue;
        }

        insert.run(
          r._id,
          r.index,
          r.isBOTD ? 1 : 0,
          r.Cost,
          r.Image ?? null,
          r.colour ?? null,
          r.Name,
          r.Description ?? null,
          r.Country ?? null,
        );

        console.log(r.Name, 'inserted into table');
      }
    });

    tx(seedData);
  }

  onModuleDestroy() {
    this.closer.close();
  }
}
