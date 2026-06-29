const { z } = require("zod");

const idParamSchema = z.object({
  id: z.string().uuid("ID harus berupa UUID yang valid")
});

const paginationQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
});

module.exports = {
  idParamSchema,
  paginationQuerySchema
};
