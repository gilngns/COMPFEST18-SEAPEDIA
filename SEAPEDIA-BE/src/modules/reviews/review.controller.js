const usecase = require("./review.usecase");
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");

const createReview = catchAsync(async (req, res) => {
  const data = await usecase.createReview(req.body);
  successResponse(res, 201, "Ulasan berhasil dikirim", data);
});

const listReviews = catchAsync(async (req, res) => {
  const data = await usecase.listReviews();
  successResponse(res, 200, "Berhasil mengambil ulasan", data);
});

module.exports = { createReview, listReviews };