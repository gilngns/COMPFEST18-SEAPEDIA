const usecase = require("./review.usecase");

async function createReview(req, res, next) {
  try {
    const data = await usecase.createReview(req.body);
    res.status(201).json({ success: true, message: "Ulasan berhasil dikirim", data });
  } catch (err) {
    next(err);
  }
}

async function listReviews(req, res, next) {
  try {
    const data = await usecase.listReviews();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, listReviews };