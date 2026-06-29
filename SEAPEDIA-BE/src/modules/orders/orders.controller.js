const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./orders.usecase");

const previewCheckout = catchAsync(async (req, res, next) => {
    const discountCode = req.query.discountCode;
    const data = await usecase.previewCheckout(req.user.userId, discountCode);
    res.json({ data });
  });

const checkout = catchAsync(async (req, res, next) => {
    const data = await usecase.checkout(req.user.userId, req.body);
    res.status(201).json({ message: "Checkout berhasil", data });
  });

const getMyOrders = catchAsync(async (req, res, next) => {
    const data = await usecase.getMyOrders(req.user.userId);
    res.json({ data });
  });

const getStoreOrders = catchAsync(async (req, res, next) => {
    const data = await usecase.getStoreOrders(req.user.userId);
    res.json({ data });
  });

const updateOrderStatus = catchAsync(async (req, res, next) => {
    const data = await usecase.updateOrderStatus(
      req.user.userId,
      req.params.id,
      req.body.status
    );
    res.json({ message: "Status pesanan diperbarui", data });
  });

module.exports = {
  previewCheckout,
  checkout,
  getMyOrders,
  getStoreOrders,
  updateOrderStatus
};
