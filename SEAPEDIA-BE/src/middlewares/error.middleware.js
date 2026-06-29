const AppError = require("../utils/AppError");

const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} tidak ditemukan`, 404));
};

const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || err.status || 500;
  err.status = err.status || "error";

  if (!err.isOperational) {
    console.error("ERROR:", err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = {
  notFoundMiddleware,
  globalErrorMiddleware,
};
