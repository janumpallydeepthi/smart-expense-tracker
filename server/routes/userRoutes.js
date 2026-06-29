// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { deleteUser } = require('../controllers/userController');

// Protected route - delete user account
router.delete('/me', authMiddleware, deleteUser);

module.exports = router;