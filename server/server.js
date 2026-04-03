const express = require('express');
const app = express();

// simple route
app.get('/', (req, res) => {
    res.send("Server is running");
});

// start server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});