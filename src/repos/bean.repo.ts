import { Inject, Injectable } from '@nestjs/common';
import { Bean } from 'src/models/beanDto';
import { SQLITE_DB } from 'src/util/constants';
import type { Database as SqliteDb } from 'better-sqlite3';
import { PostBeanRequestBody } from 'src/models/postBeanDto';

@Injectable()
export class BeanRepo {
  constructor(@Inject(SQLITE_DB) private readonly sqliteDb: SqliteDb) {}

  async selectAllBeans(): Promise<Bean[]> {
    const select = this.sqliteDb.prepare('SELECT * FROM beans');
    const res = select.all() as Bean[];
    return res;
  }

  async insertBean(bean: PostBeanRequestBody): Promise<boolean> {
    const insert = this.sqliteDb.prepare(
      'INSERT INTO beans (Cost, Image, colour, Name, Description, Country) VALUES (?, ?, ?, ?, ?, ?)',
    );

    const tx = this.sqliteDb.transaction((bean: PostBeanRequestBody) => {
      const res = insert.run(
        bean.Cost,
        bean.Image,
        bean.colour,
        bean.Name,
        bean.Description,
        bean.Country,
      );

      return res.changes as number;
    });

    const txResChanges = tx(bean);
    if (txResChanges === 0) {
      throw new Error('Failed to insert bean');
    }

    return txResChanges > 0;
  }

  async updateBean(
    id: string,
    beanData: PostBeanRequestBody,
  ): Promise<boolean> {
    const update = this.sqliteDb.prepare(
      'UPDATE beans SET Cost = ?, Image = ?, colour = ?, Name = ?, Description = ?, Country = ? WHERE _id = ?',
    );
    const tx = this.sqliteDb.transaction((beanData: PostBeanRequestBody) => {
      const res = update.run(
        beanData.Cost,
        beanData.Image,
        beanData.colour,
        beanData.Name,
        beanData.Description,
        beanData.Country,
        id,
      );
      return res.changes as number;
    });

    const txResChanges = tx(beanData);
    if (txResChanges === 0) {
      throw new Error('Failed to update bean');
    }

    return txResChanges > 0;
  }

  async deleteBean(id: string): Promise<boolean> {
    const deleteSql = this.sqliteDb.prepare('DELETE FROM beans WHERE _id = ?');
    const tx = this.sqliteDb.transaction((id: string) => {
      const res = deleteSql.run(id);
      return res.changes as number;
    });

    const txResChanges = tx(id);
    if (txResChanges === 0) {
      throw new Error('Failed to delete bean');
    }

    return txResChanges > 0;
  }

  async selectBotd(): Promise<Bean | undefined> {
    const select = this.sqliteDb.prepare(
      'SELECT * FROM beans WHERE isBOTD = 1 LIMIT 1',
    );
    const res = select.get() as Bean | undefined;
    return res;
  }

  async selectNonBotd(botdId: string): Promise<Bean> {
    const stmt = this.sqliteDb.prepare(
      'SELECT * FROM beans WHERE _id <> ? ORDER BY RANDOM() LIMIT 1',
    );
    const res = stmt.get(botdId) as Bean;
    return res;
  }

  async updateBotd(botdId: string): Promise<void> {
    const clearStmt = this.sqliteDb.prepare(
      'UPDATE beans SET isBOTD = 0 WHERE isBOTD = 1',
    );
    const setStmt = this.sqliteDb.prepare(
      'UPDATE beans SET isBOTD = 1 WHERE _id = ?',
    );

    const tx = this.sqliteDb.transaction((botdId: string) => {
      clearStmt.run();
      const res = setStmt.run(botdId);
      if ((res.changes as number) === 0) {
        throw new Error('Failed to set new BOTD');
      }
    });

    tx(botdId);
  }

  async searchBeans(criteria: string, value: string): Promise<Bean[]> {
    const validCriteria = ['colour', 'Name', 'Country'];
    if (!validCriteria.includes(criteria)) {
      throw new Error('Invalid search criteria');
    }

    const select = this.sqliteDb.prepare(
      `SELECT * FROM beans WHERE ${criteria} LIKE ?`,
    );
    const res = select.all(`%${value}%`) as Bean[];
    return res;
  }
}
