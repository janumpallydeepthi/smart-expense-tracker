const express = require('express');
const app = express();

const cors = require("cors");

require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const authMiddleware = require('./middleware/auth');

app.use(cors());
app.use(express.json()); // reads json data

// test route
app.get('/', async (req, res) => {
    res.send("API running...");
});

// use routes
app.use('/api', authRoutes);
app.use('/api/expenses', expenseRoutes);

// create a proctored route
app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        user: req.user
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});