const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./buyer.usecase");



const getWallet = catchAsync(async (req, res, next) => {
    const data = await usecase.getWallet(req.user.userId);
    res.json({ data });
  });

const topUpWallet = catchAsync(async (req, res, next) => {
    const { amount } = req.body;
    const data = await usecase.topUpWallet(req.user.userId, amount);
    res.json({ message: "Top-up berhasil", data });
  });

const getWalletTransactions = catchAsync(async (req, res, next) => {
    const data = await usecase.getWalletTransactions(req.user.userId);
    res.json({ data });
  });



const getAddresses = catchAsync(async (req, res, next) => {
    const data = await usecase.getAddresses(req.user.userId);
    res.json({ data });
  });

const addAddress = catchAsync(async (req, res, next) => {
    const data = await usecase.addAddress(req.user.userId, req.body);
    res.status(201).json({ message: "Alamat ditambahkan", data });
  });

const deleteAddress = catchAsync(async (req, res, next) => {
    await usecase.deleteAddress(req.user.userId, req.params.id);
    res.json({ message: "Alamat dihapus" });
  });

const setDefaultAddress = catchAsync(async (req, res, next) => {
    const data = await usecase.setDefaultAddress(req.user.userId, req.params.id);
    res.json(data); 
  });

const submitReview = catchAsync(async (req, res, next) => {
    const { id } = req.params; 
    const { reviews } = req.body;
    const data = await usecase.submitReview(req.user.userId, id, reviews);
    res.json(data);
  });

module.exports = {
  getWallet,
  topUpWallet,
  getWalletTransactions,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  submitReview
};
