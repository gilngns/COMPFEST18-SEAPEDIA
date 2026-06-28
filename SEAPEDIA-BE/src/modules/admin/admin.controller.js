const usecase = require("./admin.usecase");

async function createVoucher(req, res, next) {
  try {
    const data = await usecase.createVoucher(req.body);
    res.status(201).json({ message: "Voucher berhasil dibuat", data });
  } catch (err) {
    next(err);
  }
}

async function createPromo(req, res, next) {
  try {
    const data = await usecase.createPromo(req.body);
    res.status(201).json({ message: "Promo berhasil dibuat", data });
  } catch (err) {
    next(err);
  }
}

async function simulateDay(req, res, next) {
  try {
    const data = await usecase.simulateNextDay();
    res.json({ message: "Simulasi hari berhasil ditambahkan", data });
  } catch (err) {
    next(err);
  }
}
async function getVouchers(req, res, next) {
  try {
    const data = await usecase.getVouchers();
    res.json({ message: "Berhasil mengambil data voucher", data });
  } catch (err) {
    next(err);
  }
}

async function getPromos(req, res, next) {
  try {
    const data = await usecase.getPromos();
    res.json({ message: "Berhasil mengambil data promo", data });
  } catch (err) {
    next(err);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const data = await usecase.getDashboardStats();
    res.json({ message: "Berhasil mengambil statistik dashboard", data });
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const data = await usecase.getOrders();
    res.json({ message: "Berhasil mengambil data pesanan", data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createVoucher,
  createPromo,
  getVouchers,
  getPromos,
  getOrders,
  getDashboardStats,
  simulateDay
};
