// import libraries
import { createPool, MysqlError, Pool } from 'mysql';
import { Obj } from '../../src/conf/types';

// creating mysql connection
export const pool: Pool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'library',
  password: process.env.MYSQL_PASSWORD || 'library_app',
  database: process.env.MYSQL_DATABASE || 'library_db',
  connectionLimit: 10,
  dateStrings: true,
});

export const query = (query: string, values: string[] | number[] = []): Promise<Obj> => {
  return new Promise<Obj>((resolve, reject) => {
    pool.query(query, [...values], (db_error: MysqlError | null, db_result: any): void => {
      if (db_error) reject(db_error.message);
      resolve(db_result);
    });
  });
};

export const get_some_db_user = (): Promise<Obj> => {
  return new Promise<Obj>((resolve, reject) => {
    pool.query('select * from users', (db_error: MysqlError | null, db_result: any): void => {
      if (db_error) reject(db_error.message);
      resolve(db_result[Math.floor(Math.random() * db_result.length)]);
    });
  });
};
