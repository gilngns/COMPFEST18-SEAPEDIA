const service = require("./review.service");

async function create(req, res, next) {
  try {
    const review = await service.createReview(req.body);
    res.status(201).json({ message: "Review terkirim", data: review });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const reviews = await service.listReviews();
    res.json({ data: reviews });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };