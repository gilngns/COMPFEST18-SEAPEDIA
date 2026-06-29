const reviewRepository = require("./review.repository");
const AppError = require("../../utils/AppError");

const createReview = async ({ name, rating, comment }) => {
    const r = Number(rating);

    const cleanName = String(name).trim();
    const cleanComment = String(comment).trim();

    return reviewRepository.createReview({
      name: cleanName,
      rating: r,
      comment: cleanComment
    });
  }
const listReviews = async () => {
    return reviewRepository.listReviews();
  }

module.exports = { createReview, listReviews };

