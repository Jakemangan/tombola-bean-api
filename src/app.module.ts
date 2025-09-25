import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from 'better-sqlite3';
import type { Database as BetterSqlite3Database } from 'better-sqlite3';

export const SQLITE_DB = 'SQLITE_DB';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
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
      useFactory: (db: BetterSqlite3Database) => {
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
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject('SQLITE_DB_CLOSER') private readonly closer: { close: () => void },
  ) {}

  onModuleInit() {
    console.log('AppModule initialized');
  }

  onModuleDestroy() {
    this.closer.close();
  }
}
