const { z } = require("zod");

const validateDiscountSchema = {
  body: z.object({
    code: z.string().min(1, "Kode diskon wajib diisi")
  })
};

module.exports = {
  validateDiscountSchema
};
