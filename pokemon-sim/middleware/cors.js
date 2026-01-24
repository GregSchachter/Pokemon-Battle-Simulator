const cors = require("cors");

var corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pokemon-battle-simulator-c3n7.onrender.com",
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
