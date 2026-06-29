const { z } = require("zod");
const { idParamSchema } = require("../../utils/common.validation");

const upsertStoreSchema = {
  body: z.object({
    name: z.string().min(1, "Nama toko wajib diisi"),
    description: z.string().optional().nullable(),
    domain: z.string().optional().nullable(),
    slogan: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    isOpen: z.string().transform(v => v === "true").optional(),
    logoUrl: z.string().optional()
  })
};

const createProductSchema = {
  body: z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    description: z.string().optional().nullable(),
    price: z.string().transform(v => Number(v)).refine(n => !isNaN(n) && n >= 0, "Harga harus angka >= 0"),
    stock: z.string().transform(v => Number(v)).refine(n => Number.isInteger(n) && n >= 0, "Stok harus bilangan bulat >= 0"),
    unit: z.string().optional(),
    images: z.any().optional() 
  })
};

const updateProductSchema = {
  params: idParamSchema,
  body: z.object({
    name: z.string().min(1, "Nama produk wajib diisi").optional(),
    description: z.string().optional().nullable(),
    price: z.string().transform(v => Number(v)).refine(n => !isNaN(n) && n >= 0, "Harga harus angka >= 0").optional(),
    stock: z.string().transform(v => Number(v)).refine(n => Number.isInteger(n) && n >= 0, "Stok harus bilangan bulat >= 0").optional(),
    unit: z.string().optional(),
    isActive: z.string().transform(v => v === "true").optional(),
    images: z.any().optional()
  })
};

const withdrawSchema = {
  body: z.object({
    amount: z.number({ required_error: "Jumlah penarikan wajib diisi", invalid_type_error: "Jumlah harus berupa angka" }).positive("Jumlah penarikan tidak valid")
  })
};

module.exports = {
  upsertStoreSchema,
  createProductSchema,
  updateProductSchema,
  withdrawSchema
};
