// Pool means db connection again & again not required
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'expense_tracker',
    password: 'deepu@09',
    port: 5432,
});

module.exports = pool;
