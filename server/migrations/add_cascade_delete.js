// server/migrations/add_cascade_delete.js

const pool = require('../config/db');

async function addCascadeDelete() {
    try {
        console.log('🔄 Adding cascade delete to expenses table...');
        
        // First, drop the existing foreign key constraint
        await pool.query(`
            ALTER TABLE expenses 
            DROP CONSTRAINT expenses_user_id_fkey;
        `);
        
        // Then, re-add it with CASCADE DELETE
        await pool.query(`
            ALTER TABLE expenses 
            ADD CONSTRAINT expenses_user_id_fkey 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE CASCADE;
        `);
        
        console.log('Cascade delete added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

// Run the migration
addCascadeDelete();