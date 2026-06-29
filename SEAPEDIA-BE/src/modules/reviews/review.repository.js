const prisma = require("../../config/prisma");

const createReview = async (data) => {
    return prisma.appReview.create({
      data,
    });
  }
const listReviews = async () => {
    return prisma.appReview.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

module.exports = { createReview, listReviews };

