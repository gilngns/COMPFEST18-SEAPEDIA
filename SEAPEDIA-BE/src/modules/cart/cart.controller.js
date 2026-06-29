const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./cart.usecase");

const getCart = catchAsync(async (req, res, next) => {
    const data = await usecase.getCart(req.user.userId);
    res.json({ data });
});

const addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity, replaceStore } = req.body;
    try {
      const data = await usecase.addToCart(req.user.userId, productId, quantity, replaceStore);
      res.json({ message: "Berhasil ditambahkan ke keranjang", data });
    } catch (err) {
      if (err.code === "DIFFERENT_STORE") {
        return res.status(err.status || 409).json({ error: err.message, code: err.code });
      }
      next(err);
    }
});

const updateCartItem = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const data = await usecase.updateCartItem(req.user.userId, id, quantity);
    res.json({ message: "Kuantitas diperbarui", data });
});

const removeCartItem = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await usecase.removeCartItem(req.user.userId, id);
    res.json({ message: "Item dihapus", data });
});

const clearCart = catchAsync(async (req, res, next) => {
    const data = await usecase.clearCart(req.user.userId);
    res.json({ message: "Keranjang dikosongkan", data });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
