const usecase = require("./admin.usecase");
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");

const createVoucher = catchAsync(async (req, res) => {
  const data = await usecase.createVoucher(req.body);
  successResponse(res, 201, "Voucher berhasil dibuat", data);
});

const createPromo = catchAsync(async (req, res) => {
  const data = await usecase.createPromo(req.body);
  successResponse(res, 201, "Promo berhasil dibuat", data);
});

const simulateDay = catchAsync(async (req, res) => {
  const data = await usecase.simulateNextDay();
  successResponse(res, 200, "Simulasi hari berhasil ditambahkan", data);
});

const getVouchers = catchAsync(async (req, res) => {
  const data = await usecase.getVouchers();
  successResponse(res, 200, "Berhasil mengambil data voucher", data);
});

const getPromos = catchAsync(async (req, res) => {
  const data = await usecase.getPromos();
  successResponse(res, 200, "Berhasil mengambil data promo", data);
});

const getDashboardStats = catchAsync(async (req, res) => {
  const data = await usecase.getDashboardStats();
  successResponse(res, 200, "Berhasil mengambil statistik dashboard", data);
});

const getOrders = catchAsync(async (req, res) => {
  const data = await usecase.getOrders();
  successResponse(res, 200, "Berhasil mengambil data pesanan", data);
});

module.exports = {
  createVoucher,
  createPromo,
  getVouchers,
  getPromos,
  getOrders,
  getDashboardStats,
  simulateDay
};
