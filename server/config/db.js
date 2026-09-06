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
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
  // Force IPv4 and use the correct host
  host: 'db.exxfdamrsbdvhvchikxh.supabase.co',
  port: 5432,
  family: 4,
  keepAlive: true,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your DATABASE_URL environment variable.');
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully to Supabase');
    release();
  }
});

module.exports = pool;
