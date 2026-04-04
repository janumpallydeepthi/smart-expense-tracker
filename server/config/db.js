const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'expense_tracker',
    password: 'deepu@09',  // Replace with your actual password
    port: 5432,
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

module.exports = pool;