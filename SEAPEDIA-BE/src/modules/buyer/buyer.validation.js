const { z } = require("zod");
const { idParamSchema } = require("../../utils/common.validation");

const topUpSchema = {
  body: z.object({
    amount: z.number({ required_error: "Nominal top-up wajib diisi", invalid_type_error: "Nominal harus berupa angka" }).positive("Nominal top-up harus lebih dari 0")
  })
};

const addAddressSchema = {
  body: z.object({
    label: z.string().min(1, "Semua kolom alamat wajib diisi"),
    recipient: z.string().min(1, "Semua kolom alamat wajib diisi"),
    phone: z.string().min(1, "Semua kolom alamat wajib diisi"),
    detail: z.string().min(1, "Semua kolom alamat wajib diisi"),
    isDefault: z.boolean().optional()
  })
};

const submitReviewSchema = {
  params: idParamSchema,
  body: z.array(
    z.object({
      productId: z.string().uuid("ID produk harus UUID valid"),
      rating: z.number().min(1, "Rating harus antara 1 sampai 5").max(5, "Rating harus antara 1 sampai 5"),
      comment: z.string().optional()
    })
  ).min(1, "Minimal satu ulasan harus dikirim")
};

module.exports = {
  topUpSchema,
  addAddressSchema,
  submitReviewSchema
};
