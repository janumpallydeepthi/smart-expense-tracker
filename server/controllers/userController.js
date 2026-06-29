// server/controllers/userController.js

const pool = require('../config/db');

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        
        console.log(`🗑️ Deleting user ${userId} and all their expenses...`);
        
        // With CASCADE DELETE, this will automatically delete all expenses
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id, email',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        console.log('✅ User and all expenses deleted successfully');
        res.json({ 
            success: true, 
            message: 'Account deleted successfully',
            deletedUser: result.rows[0]
        });
        
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete account',
            error: err.message 
        });
    }
};

module.exports = { deleteUser };