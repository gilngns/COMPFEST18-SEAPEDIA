const discountRepository = require("./discount.repository");

class DiscountUseCase {
  async listAvailableDiscounts() {
    const vouchers = await discountRepository.listVouchers();
    const promos = await discountRepository.listPromos();

    return { vouchers, promos };
  }

  async validateDiscount(code) {
    if (!code) throw { status: 400, message: "Kode diskon wajib diisi" };

    const cCode = code.trim().toUpperCase();

    // Check Voucher first
    const voucher = await discountRepository.getVoucherByCode(cCode);
    if (voucher) {
      if (new Date(voucher.expiryDate) < new Date()) {
        throw { status: 400, message: "Voucher sudah kedaluwarsa" };
      }
      if (voucher.remainingUsage <= 0) {
        throw { status: 400, message: "Batas pemakaian voucher sudah habis" };
      }
      return { type: "VOUCHER", data: voucher };
    }

    // Check Promo
    const promo = await discountRepository.getPromoByCode(cCode);
    if (promo) {
      if (new Date(promo.expiryDate) < new Date()) {
        throw { status: 400, message: "Promo sudah kedaluwarsa" };
      }
      return { type: "PROMO", data: promo };
    }

    throw { status: 404, message: "Kode diskon tidak valid atau tidak ditemukan" };
  }
}

module.exports = new DiscountUseCase();
