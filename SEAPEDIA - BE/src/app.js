// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ---- middlewares global ----
app.use(cors());
app.use(express.json());

// ---- health check ----
app.get("/", (req, res) => {
  res.json({ message: "SEAPEDIA API jalan 🚀" });
});

// ---- routes ----
app.use("/api/auth", require("./modules/auth/auth.routes"));
// app.use("/api/stores", require("./modules/stores/store.routes"));   // nanti
// app.use("/api/products", require("./modules/products/product.routes")); // nanti

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// ---- error handler global (paling bawah) ----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

module.exports = app;