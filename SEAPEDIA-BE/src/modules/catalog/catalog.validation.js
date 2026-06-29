const { z } = require("zod");
const { paginationQuerySchema } = require("../../utils/common.validation");

const listProductsSchema = {
  query: z.object({
    search: z.string().optional(),
    categoryId: z.string().uuid("Kategori tidak valid").optional(),
    minPrice: z.string().transform(v => Number(v)).optional(),
    maxPrice: z.string().transform(v => Number(v)).optional(),
    sort: z.string().optional(),
    locations: z.string().optional(),
    rating: z.string().transform(v => Number(v)).optional(),
    conditions: z.string().optional(),
  }).merge(paginationQuerySchema)
};

module.exports = {
  listProductsSchema
};
