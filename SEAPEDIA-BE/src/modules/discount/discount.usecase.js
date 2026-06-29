const AppError = require("../../utils/AppError");
const discountRepository = require("./discount.repository");

const listAvailableDiscounts = async () => {
    const vouchers = await discountRepository.listVouchers();
    const promos = await discountRepository.listPromos();

    return { vouchers, promos };
  }
const validateDiscount = async (code) => {

    const cCode = code.trim().toUpperCase();

    
    const voucher = await discountRepository.getVoucherByCode(cCode);
    if (voucher) {
      if (new Date(voucher.expiryDate) < new Date()) {
        throw new AppError("Voucher sudah kedaluwarsa", 400);
      }
      if (voucher.remainingUsage <= 0) {
        throw new AppError("Batas pemakaian voucher sudah habis", 400);
      }
      return { type: "VOUCHER", data: voucher };
    }

    
    const promo = await discountRepository.getPromoByCode(cCode);
    if (promo) {
      if (new Date(promo.expiryDate) < new Date()) {
        throw new AppError("Promo sudah kedaluwarsa", 400);
      }
      return { type: "PROMO", data: promo };
    }

    throw new AppError("Kode diskon tidak valid atau tidak ditemukan", 404);
  }

module.exports = { listAvailableDiscounts, validateDiscount };

