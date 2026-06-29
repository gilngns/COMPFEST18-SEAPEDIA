const { z } = require("zod");

const createVoucherSchema = {
  body: z.object({
    code: z.string().min(1, "code wajib diisi"),
    description: z.string().optional().nullable(),
    amount: z.number({ required_error: "amount wajib diisi", invalid_type_error: "amount harus berupa angka" }),
    isPercent: z.boolean().optional(),
    expiryDate: z.string({ required_error: "expiryDate wajib diisi" }),
    remainingUsage: z.number({ required_error: "remainingUsage wajib diisi", invalid_type_error: "remainingUsage harus berupa angka" })
  })
};

const createPromoSchema = {
  body: z.object({
    code: z.string().min(1, "code wajib diisi"),
    description: z.string().optional().nullable(),
    amount: z.number({ required_error: "amount wajib diisi", invalid_type_error: "amount harus berupa angka" }),
    isPercent: z.boolean().optional(),
    expiryDate: z.string({ required_error: "expiryDate wajib diisi" })
  })
};

module.exports = {
  createVoucherSchema,
  createPromoSchema
};
