const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./seller.usecase");


const upsertStore = catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (req.file) data.logoUrl = `/uploads/products/${req.file.filename}`;
    if (data.isOpen !== undefined) {
      data.isOpen = data.isOpen === "true" || data.isOpen === true;
    }
    
    const result = await usecase.upsertStore(req.user.userId, data);
    res.json({ message: "Toko berhasil disimpan", data: result });
  });

const getMyStore = catchAsync(async (req, res, next) => {
    const data = await usecase.getMyStore(req.user.userId);
    res.json({ data });
  });

const getPublicStore = catchAsync(async (req, res, next) => {
    const data = await usecase.getPublicStore(req.params.id);
    res.json({ data });
  });

const createProduct = catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/products/${f.filename}`);
    }
    const product = await usecase.createProduct(req.user.userId, data);
    res.status(201).json({ message: "Produk ditambahkan", data: product });
  });

const listMyProducts = catchAsync(async (req, res, next) => {
    const data = await usecase.listMyProducts(req.user.userId);
    res.json({ data });
  });

const updateProduct = catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/products/${f.filename}`);
    }
    const product = await usecase.updateProduct(req.user.userId, req.params.id, data);
    res.json({ message: "Produk diupdate", data: product });
  });

const deleteProduct = catchAsync(async (req, res, next) => {
    await usecase.deleteProduct(req.user.userId, req.params.id);
    res.json({ message: "Produk dinonaktifkan" });
  });

const getWallet = catchAsync(async (req, res, next) => {
    const data = await usecase.getWallet(req.user.userId);
    res.json({ data });
  });

const getWalletTransactions = catchAsync(async (req, res, next) => {
    const data = await usecase.getWalletTransactions(req.user.userId);
    res.json({ data });
  });

const withdrawFunds = catchAsync(async (req, res, next) => {
    const data = await usecase.withdrawFunds(req.user.userId, req.body.amount);
    res.json({ message: "Penarikan dana berhasil", data });
  });

module.exports = {
  upsertStore,
  getMyStore,
  getPublicStore,
  createProduct,
  listMyProducts,
  updateProduct,
  deleteProduct,
  getWallet,
  getWalletTransactions,
  withdrawFunds,
};