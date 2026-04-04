const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        
        // Log token info for debugging (remove in production)
        console.log("Token received:", token.substring(0, 20) + "...");
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("✅ Token verified for user:", decoded.email);
        
        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };
        
        next();
    } catch (error) {
        console.error("❌ Auth error:", error.message);
        
        // Send specific error messages
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please login again." });
        }
        
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = authMiddleware;