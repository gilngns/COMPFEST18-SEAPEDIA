const service = require("./cart.service");

async function getCart(req, res, next) {
  try {
    const cart = await service.getCart(req.user.userId);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity, replaceStore } = req.body;
    const cart = await service.addToCart(req.user.userId, productId, quantity, replaceStore);
    res.json({ message: "Item ditambahkan ke keranjang", data: cart });
  } catch (err) {
    // If it's a conflict for single-store, the error is handled here and passes 409
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;
    const cart = await service.updateCartItem(req.user.userId, req.params.id, quantity);
    res.json({ message: "Kuantitas diperbarui", data: cart });
  } catch (err) {
    next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cart = await service.removeCartItem(req.user.userId, req.params.id);
    res.json({ message: "Item dihapus dari keranjang", data: cart });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const cart = await service.clearCart(req.user.userId);
    res.json({ message: "Keranjang dikosongkan", data: cart });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
