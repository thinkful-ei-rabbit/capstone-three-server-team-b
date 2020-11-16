require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  host: process.env.MIGRATION_DB_HOST,
  port: process.env.MIGRATION_DB_PORT,
  database: process.env.MIGRATION_DB_NAME || 'capstone-3',
  username: process.env.MIGRATION_DB_USER || 'postgres',
  password: process.env.MIGRATION_DB_PASS || '',

};
