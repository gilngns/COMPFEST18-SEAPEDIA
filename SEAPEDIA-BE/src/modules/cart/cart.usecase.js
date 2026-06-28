const cartRepository = require("./cart.repository");

class CartUseCase {
  async getCart(buyerId) {
    let cart = await cartRepository.getCart(buyerId);
    if (!cart) {
      cart = await cartRepository.createCart(buyerId);
    }
    return cart;
  }

  async addToCart(buyerId, productId, quantity, replaceStore = false) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw { status: 400, message: "Kuantitas minimal 1" };
    }

    const product = await cartRepository.findProduct(productId);
    if (!product) {
      throw { status: 404, message: "Produk tidak ditemukan atau tidak aktif" };
    }

    if (product.stock < qty) {
      throw { status: 400, message: "Stok produk tidak mencukupi" };
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
        throw { status: 400, message: "Total kuantitas melebihi stok yang tersedia" };
      }
      await cartRepository.updateCartItemQuantity(existingItem.id, newQty);
    } else {
      await cartRepository.createCartItem(cart.id, productId, qty);
    }

    return this.getCart(buyerId);
  }

  async updateCartItem(buyerId, itemId, quantity) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw { status: 400, message: "Kuantitas minimal 1" };
    }

    const cart = await cartRepository.getCart(buyerId);
    if (!cart) throw { status: 404, message: "Keranjang tidak ditemukan" };

    const item = await cartRepository.getCartItemWithProduct(itemId);

    if (!item || item.cartId !== cart.id) {
      throw { status: 404, message: "Item tidak ditemukan di keranjang" };
    }

    if (item.product.stock < qty) {
      throw { status: 400, message: "Stok produk tidak mencukupi" };
    }

    await cartRepository.updateCartItemQuantity(itemId, qty);

    return this.getCart(buyerId);
  }

  async removeCartItem(buyerId, itemId) {
    const cart = await cartRepository.getCart(buyerId);
    if (!cart) throw { status: 404, message: "Keranjang tidak ditemukan" };

    const item = await cartRepository.getCartItemById(itemId);
    if (!item || item.cartId !== cart.id) {
      throw { status: 404, message: "Item tidak ditemukan di keranjang" };
    }

    await cartRepository.deleteCartItem(itemId);

    const remaining = await cartRepository.countCartItems(cart.id);
    if (remaining === 0) {
      await cartRepository.updateCartStore(cart.id, null);
    }

    return this.getCart(buyerId);
  }

  async clearCart(buyerId) {
    const cart = await cartRepository.getCart(buyerId);
    if (cart) {
      await cartRepository.clearCartItems(cart.id);
      await cartRepository.updateCartStore(cart.id, null);
    }
    return this.getCart(buyerId);
  }
}

module.exports = new CartUseCase();
