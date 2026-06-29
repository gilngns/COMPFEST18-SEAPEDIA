const adminRepository = require("./admin.repository");
const { getSimulatedDate } = require("../../utils/clock");
const AppError = require("../../utils/AppError");

const createVoucher = async ({ code, description, amount, isPercent, expiryDate, remainingUsage }) => {

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
      if (err.code === "P2002") throw new AppError("Kode voucher sudah ada", 400);
      throw err;
    }
  }
const createPromo = async ({ code, description, amount, isPercent, expiryDate }) => {

    try {
      return await adminRepository.createPromo({
        code: code.trim().toUpperCase(),
        description: description || null,
        amount: Number(amount),
        isPercent: Boolean(isPercent),
        expiryDate: new Date(expiryDate)
      });
    } catch (err) {
      if (err.code === "P2002") throw new AppError("Kode promo sudah ada", 400);
      throw err;
    }
  }
const getVouchers = async () => {
    return await adminRepository.getVouchers();
  }
const getOrders = async () => {
    return await adminRepository.getOrders();
  }
const getPromos = async () => {
    return await adminRepository.getPromos();
  }
const getDashboardStats = async () => {
    return await adminRepository.getDashboardStats();
  }
const simulateNextDay = async () => {
    const clock = await adminRepository.incrementDayOffset();
    const simulatedNow = await getSimulatedDate();
    const refundedCount = await adminRepository.processOverdueOrders(simulatedNow);
    
    return {
      dayOffset: clock.dayOffset,
      simulatedDate: simulatedNow,
      refundedCount
    };
  }

module.exports = { createVoucher, createPromo, getVouchers, getOrders, getPromos, getDashboardStats, simulateNextDay };

