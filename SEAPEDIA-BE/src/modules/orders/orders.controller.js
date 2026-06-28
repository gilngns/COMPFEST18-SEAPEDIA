const usecase = require("./orders.usecase");

async function previewCheckout(req, res, next) {
  try {
    const discountCode = req.query.discountCode;
    const data = await usecase.previewCheckout(req.user.userId, discountCode);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function checkout(req, res, next) {
  try {
    const data = await usecase.checkout(req.user.userId, req.body);
    res.status(201).json({ message: "Checkout berhasil", data });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const data = await usecase.getMyOrders(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getStoreOrders(req, res, next) {
  try {
    const data = await usecase.getStoreOrders(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const data = await usecase.updateOrderStatus(
      req.user.userId,
      req.params.id,
      req.body.status
    );
    res.json({ message: "Status pesanan diperbarui", data });
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
