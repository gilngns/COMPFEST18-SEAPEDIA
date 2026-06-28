const reviewRepository = require("./review.repository");

class ReviewUseCase {
  async createReview({ name, rating, comment }) {
    if (!name || !comment) {
      throw { status: 400, message: "Nama dan komentar wajib diisi" };
    }
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      throw { status: 400, message: "Rating harus angka 1 sampai 5" };
    }

    const cleanName = String(name).trim().slice(0, 50);
    const cleanComment = String(comment).trim().slice(0, 500);

    if (!cleanName || !cleanComment) {
      throw { status: 400, message: "Nama dan komentar tidak boleh kosong" };
    }

    return reviewRepository.createReview({
      name: cleanName,
      rating: r,
      comment: cleanComment
    });
  }

  async listReviews() {
    return reviewRepository.listReviews();
  }
}

module.exports = new ReviewUseCase();
