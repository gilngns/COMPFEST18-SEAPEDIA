const prisma = require("../../config/prisma");

class ReviewRepository {
  async createReview(data) {
    return prisma.appReview.create({
      data,
    });
  }

  async listReviews() {
    return prisma.appReview.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new ReviewRepository();
