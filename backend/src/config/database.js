import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import environment from './environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  user: environment.DB_USER,
  password: environment.DB_PASSWORD,
  database: environment.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  charset: 'utf8mb4'
});

export const database = pool;

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function ensureDatabase() {
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const connection = await pool.getConnection();
    try {
      await connection.query(schemaSql);

      const settingsColumns = [
        ['skills_degree_label', "VARCHAR(255) NOT NULL DEFAULT 'HND IT'"],
        ['about_degree_title', "VARCHAR(255) NOT NULL DEFAULT 'HND Information Technology'"]
      ];

      for (const [name, definition] of settingsColumns) {
        const [columns] = await connection.query('SHOW COLUMNS FROM site_settings LIKE ?', [name]);
        if (columns.length === 0) {
          await connection.query(`ALTER TABLE site_settings ADD COLUMN \`${name}\` ${definition}`);
        }
      }
    } finally {
      connection.release();
    }
    return true;
  } catch (error) {
    console.warn('Database schema initialization skipped:', error.message);
    return false;
  }
}

export async function pingDatabase() {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    return rows?.[0]?.ok === 1;
  } catch (error) {
    console.warn('MySQL connection failed:', error.message);
    return false;
  }
}
