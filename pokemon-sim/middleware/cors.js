const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
