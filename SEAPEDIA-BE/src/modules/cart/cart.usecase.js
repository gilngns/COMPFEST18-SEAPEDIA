const AppError = require("../../utils/AppError");
const cartRepository = require("./cart.repository");

const getCart = async (buyerId) => {
    let cart = await cartRepository.getCart(buyerId);
    if (!cart) {
      cart = await cartRepository.createCart(buyerId);
    }
    return cart;
  }
const addToCart = async (buyerId, productId, quantity, replaceStore = false) => {
    const qty = Number(quantity);

    const product = await cartRepository.findProduct(productId);
    if (!product) {
      throw new AppError("Produk tidak ditemukan atau tidak aktif", 404);
    }

    if (product.stock < qty) {
      throw new AppError("Stok produk tidak mencukupi", 400);
    }

    let cart = await cartRepository.getCart(buyerId);
    if (!cart) {
      cart = await cartRepository.createCart(buyerId);
    }

    
    if (cart.storeId && cart.storeId !== product.storeId) {
      if (replaceStore) {
        await cartRepository.clearCartItems(cart.id);
        await cartRepository.updateCartStore(cart.id, product.storeId);
      } else {
        throw { 
          status: 409, 
          message: "Keranjang hanya boleh berisi produk dari 1 toko yang sama. Kosongkan keranjang saat ini?",
          code: "DIFFERENT_STORE" 
        };
      }
    } else if (!cart.storeId) {
      await cartRepository.updateCartStore(cart.id, product.storeId);
    }

    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (existingItem) {
      const newQty = existingItem.quantity + qty;
      if (newQty > product.stock) {
        throw new AppError("Total kuantitas melebihi stok yang tersedia", 400);
      }
      await cartRepository.updateCartItemQuantity(existingItem.id, newQty);
    } else {
      await cartRepository.createCartItem(cart.id, productId, qty);
    }
    return getCart(buyerId);
  }
const updateCartItem = async (buyerId, itemId, quantity) => {
    const qty = Number(quantity);

    const cart = await cartRepository.getCart(buyerId);
    if (!cart) throw new AppError("Keranjang tidak ditemukan", 404);

    const item = await cartRepository.getCartItemWithProduct(itemId);

    if (!item || item.cartId !== cart.id) {
      throw new AppError("Item tidak ditemukan di keranjang", 404);
    }

    if (item.product.stock < qty) {
      throw new AppError("Stok produk tidak mencukupi", 400);
    }

    await cartRepository.updateCartItemQuantity(itemId, qty);
    return getCart(buyerId);
  }
const removeCartItem = async (buyerId, itemId) => {
    const cart = await cartRepository.getCart(buyerId);
    if (!cart) throw new AppError("Keranjang tidak ditemukan", 404);

    const item = await cartRepository.getCartItemById(itemId);
    if (!item || item.cartId !== cart.id) {
      throw new AppError("Item tidak ditemukan di keranjang", 404);
    }

    await cartRepository.deleteCartItem(itemId);

    const remaining = await cartRepository.countCartItems(cart.id);
    if (remaining === 0) {
      await cartRepository.updateCartStore(cart.id, null);
    }
    return getCart(buyerId);
  }
const clearCart = async (buyerId) => {
    const cart = await cartRepository.getCart(buyerId);
    if (cart) {
      await cartRepository.clearCartItems(cart.id);
      await cartRepository.updateCartStore(cart.id, null);
    }    return getCart(buyerId);
  }

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };

