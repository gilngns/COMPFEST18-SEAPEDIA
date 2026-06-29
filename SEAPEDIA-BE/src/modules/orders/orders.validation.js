const { z } = require("zod");
const { idParamSchema } = require("../../utils/common.validation");

const previewCheckoutSchema = {
  query: z.object({
    discountCode: z.string().optional()
  })
};

const checkoutSchema = {
  body: z.object({
    addressId: z.string().uuid("ID Alamat tidak valid"),
    deliveryMethod: z.enum(["INSTANT", "NEXT_DAY", "REGULAR"], {
      errorMap: () => ({ message: "Metode pengiriman tidak valid" })
    }),
    discountCode: z.string().optional()
  })
};

const updateOrderStatusSchema = {
  params: idParamSchema,
  body: z.object({
    status: z.enum(["SEDANG_DIKEMAS", "MENUNGGU_PENGIRIM", "SEDANG_DIKIRIM", "PESANAN_SELESAI", "DIKEMBALIKAN"], {
      errorMap: () => ({ message: "Status pesanan tidak valid" })
    })
  })
};

module.exports = {
  previewCheckoutSchema,
  checkoutSchema,
  updateOrderStatusSchema
};
