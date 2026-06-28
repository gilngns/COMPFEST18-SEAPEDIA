const adminRepository = require("./admin.repository");
const { getSimulatedDate } = require("../../utils/clock");

class AdminUseCase {
  async createVoucher({ code, description, amount, isPercent, expiryDate, remainingUsage }) {
    if (!code || amount == null || !expiryDate || remainingUsage == null) {
      throw { status: 400, message: "code, amount, expiryDate, remainingUsage wajib diisi" };
    }

    try {
      return await adminRepository.createVoucher({
        code: code.trim().toUpperCase(),
        description: description || null,
        amount: Number(amount),
        isPercent: Boolean(isPercent),
        expiryDate: new Date(expiryDate),
        remainingUsage: Number(remainingUsage)
      });
    } catch (err) {
      if (err.code === "P2002") throw { status: 400, message: "Kode voucher sudah ada" };
      throw err;
    }
  }

  async createPromo({ code, description, amount, isPercent, expiryDate }) {
    if (!code || amount == null || !expiryDate) {
      throw { status: 400, message: "code, amount, expiryDate wajib diisi" };
    }

    try {
      return await adminRepository.createPromo({
        code: code.trim().toUpperCase(),
        description: description || null,
        amount: Number(amount),
        isPercent: Boolean(isPercent),
        expiryDate: new Date(expiryDate)
      });
    } catch (err) {
      if (err.code === "P2002") throw { status: 400, message: "Kode promo sudah ada" };
      throw err;
    }
  }

  async getVouchers() {
    return await adminRepository.getVouchers();
  }

  async getOrders() {
    return await adminRepository.getOrders();
  }

  async getPromos() {
    return await adminRepository.getPromos();
  }

  async getDashboardStats() {
    return await adminRepository.getDashboardStats();
  }

  async simulateNextDay() {
    const clock = await adminRepository.incrementDayOffset();
    const simulatedNow = await getSimulatedDate();
    const refundedCount = await adminRepository.processOverdueOrders(simulatedNow);
    
    return {
      dayOffset: clock.dayOffset,
      simulatedDate: simulatedNow,
      refundedCount
    };
  }
}

module.exports = new AdminUseCase();
