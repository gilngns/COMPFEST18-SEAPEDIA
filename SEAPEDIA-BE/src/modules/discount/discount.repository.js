const prisma = require("../../config/prisma");

class DiscountRepository {
  async getVoucherByCode(code) {
    return prisma.voucher.findUnique({ where: { code } });
  }

  async getPromoByCode(code) {
    return prisma.promo.findUnique({ where: { code } });
  }

  async listVouchers() {
    return prisma.voucher.findMany({
      where: {
        expiryDate: { gt: new Date() },
        remainingUsage: { gt: 0 }
      }
    });
  }

  async listPromos() {
    return prisma.promo.findMany({
      where: {
        expiryDate: { gt: new Date() }
      }
    });
  }
}

module.exports = new DiscountRepository();
