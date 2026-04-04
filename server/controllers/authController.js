const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("Register attempt for:", email);

        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        console.log("User registered:", newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt for:", email);

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const dbUser = user.rows[0];
        const isMatch = await bcrypt.compare(password, dbUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Make sure to include the user ID in the token
        const token = jwt.sign(
            { 
                id: dbUser.id, 
                email: dbUser.email,
                name: dbUser.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("User logged in:", { id: dbUser.id, email: dbUser.email });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser };