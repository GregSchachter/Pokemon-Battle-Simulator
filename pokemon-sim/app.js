const express = require("express");
const connectToDb = require("./db");
const cookieParser = require("cookie-parser");
const routes = require("./routes/Routes");
const corsMiddleware = require("./middleware/cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

app.use(routes);

// app.get("/", (req, res) => {
//   res.send("test");
// });

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

startServer();
