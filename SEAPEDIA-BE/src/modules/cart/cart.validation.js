const { z } = require("zod");
const { idParamSchema } = require("../../utils/common.validation");

const addToCartSchema = {
  body: z.object({
    productId: z.string().uuid("ID Produk harus UUID valid"),
    quantity: z.number({ required_error: "Kuantitas wajib diisi", invalid_type_error: "Kuantitas harus berupa angka" }).int("Kuantitas harus bilangan bulat").positive("Kuantitas minimal 1"),
    replaceStore: z.boolean().optional()
  })
};

const updateCartItemSchema = {
  params: idParamSchema,
  body: z.object({
    quantity: z.number({ required_error: "Kuantitas wajib diisi", invalid_type_error: "Kuantitas harus berupa angka" }).int("Kuantitas harus bilangan bulat").positive("Kuantitas minimal 1")
  })
};

module.exports = {
  addToCartSchema,
  updateCartItemSchema
};
