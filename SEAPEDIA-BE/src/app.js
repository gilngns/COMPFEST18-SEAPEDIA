require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.get("/", (req, res) => {
  res.json({ message: "SEAPEDIA API jalan 🚀" });
});

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/reviews", require("./modules/reviews/review.routes"));
app.use("/api/seller", require("./modules/seller/seller.routes"));
app.use("/api/catalog", require("./modules/catalog/catalog.routes")); 
app.use("/api/buyer", require("./modules/buyer/buyer.routes")); 
app.use("/api/cart", require("./modules/cart/cart.routes")); 
app.use("/api/orders", require("./modules/orders/orders.routes")); 

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

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