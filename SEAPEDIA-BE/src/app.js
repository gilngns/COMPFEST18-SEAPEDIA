const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { notFoundMiddleware, globalErrorMiddleware } = require("./middlewares/error.middleware");
const routes = require("./routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/", routes);

app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

module.exports = app;
