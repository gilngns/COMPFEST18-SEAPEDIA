const prisma = require("../../config/prisma");

async function createReview({ name, rating, comment }) {
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

  const review = await prisma.appReview.create({
    data: { name: cleanName, rating: r, comment: cleanComment },
  });

  return review;
}

async function listReviews() {
  return prisma.appReview.findMany({
    orderBy: { createdAt: "desc" },
  });
}

module.exports = { createReview, listReviews };