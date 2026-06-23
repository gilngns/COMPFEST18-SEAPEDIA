const service = require("./orders.service");

async function previewCheckout(req, res, next) {
  try {
    const preview = await service.previewCheckout(req.user.userId);
    res.json({ data: preview });
  } catch (err) {
    next(err);
  }
}

async function checkout(req, res, next) {
  try {
    const order = await service.checkout(req.user.userId, req.body);
    res.status(201).json({ message: "Checkout berhasil", data: order });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await service.getMyOrders(req.user.userId);
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
}

async function getStoreOrders(req, res, next) {
  try {
    const orders = await service.getStoreOrders(req.user.userId);
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await service.updateOrderStatus(req.user.userId, req.params.id, status);
    res.json({ message: `Status pesanan diupdate ke ${status}`, data: order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  previewCheckout,
  checkout,
  getMyOrders,
  getStoreOrders,
  updateOrderStatus
};
