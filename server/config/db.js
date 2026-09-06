// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// // Test connection on startup
// pool.connect((err, client, release) => {
//     if (err) {
//         console.error('Database connection failed:', err.message);
//         process.exit(1);
//     } else {
//         console.log('Database connected successfully');
//         release();
//     }
// });

// module.exports = pool;

const { Pool } = require('pg');

const pool = new Pool({
  // IPv4 pooler hostname
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.exxfdamrsbdvhvchikxh',
  password: 'SmartExpenseTracker2026',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
  // Force IPv4
  family: 4,
  keepAlive: true,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully to Supabase');
    release();
  }
});

module.exports = pool;
