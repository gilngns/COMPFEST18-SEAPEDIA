const prisma = require("../../config/prisma");

const getVoucherByCode = async (code) => {
    return prisma.voucher.findUnique({ where: { code } });
  }
const getPromoByCode = async (code) => {
    return prisma.promo.findUnique({ where: { code } });
  }
const listVouchers = async () => {
    return prisma.voucher.findMany({
      where: {
        expiryDate: { gt: new Date() },
        remainingUsage: { gt: 0 }
      }
    });
  }
const listPromos = async () => {
    return prisma.promo.findMany({
      where: {
        expiryDate: { gt: new Date() }
      }
    });
  }

module.exports = { getVoucherByCode, getPromoByCode, listVouchers, listPromos };

