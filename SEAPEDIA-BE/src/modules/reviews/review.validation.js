const { z } = require("zod");

const createReviewSchema = {
  body: z.object({
    name: z.string().min(1, "Nama wajib diisi").max(50, "Nama maksimal 50 karakter"),
    rating: z.number({ required_error: "Rating wajib diisi", invalid_type_error: "Rating harus berupa angka" }).int("Rating harus bilangan bulat").min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
    comment: z.string().min(1, "Komentar wajib diisi").max(500, "Komentar maksimal 500 karakter")
  })
};

module.exports = {
  createReviewSchema
};
