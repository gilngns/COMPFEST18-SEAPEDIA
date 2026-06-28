const usecase = require("./cart.usecase");

async function getCart(req, res, next) {
  try {
    const data = await usecase.getCart(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity, replaceStore } = req.body;
    const data = await usecase.addToCart(req.user.userId, productId, quantity, replaceStore);
    res.json({ message: "Berhasil ditambahkan ke keranjang", data });
  } catch (err) {
    if (err.code === "DIFFERENT_STORE") {
      return res.status(err.status || 409).json({ error: err.message, code: err.code });
    }
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const data = await usecase.updateCartItem(req.user.userId, id, quantity);
    res.json({ message: "Kuantitas diperbarui", data });
  } catch (err) {
    next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const data = await usecase.removeCartItem(req.user.userId, id);
    res.json({ message: "Item dihapus", data });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const data = await usecase.clearCart(req.user.userId);
    res.json({ message: "Keranjang dikosongkan", data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
