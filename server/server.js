const express = require('express');
const app = express();

const pool = require('./config/db'); // IMPORT DB

app.use(express.json()); // reads json data

// test route
app.get('/', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
});

const bcrypt = require('bcrypt');

// api to send data
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body; // data coming from frontend

        // CHECK IF USER EXISTS
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.json(newUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // CHECK USER
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const dbUser = user.rows[0];

        // COMPARE PASSWORD
        const isMatch = await bcrypt.compare(password, dbUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});