const prisma = require("../../config/prisma");

async function getCart(buyerId) {
  let cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              images: true,
              store: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { id: "asc" }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { buyerId },
      include: { items: true }
    });
  }

  return cart;
}

async function addToCart(buyerId, productId, quantity, replaceStore = false) {
  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    throw { status: 400, message: "Kuantitas minimal 1" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: { store: true }
  });

  if (!product) {
    throw { status: 404, message: "Produk tidak ditemukan atau tidak aktif" };
  }

  if (product.stock < qty) {
    throw { status: 400, message: "Stok produk tidak mencukupi" };
  }

  let cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { buyerId } });
  }

  // VALIDASI SINGLE STORE
  if (cart.storeId && cart.storeId !== product.storeId) {
    if (replaceStore) {
      // User setuju kosongkan keranjang untuk toko baru
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({
        where: { id: cart.id },
        data: { storeId: product.storeId }
      });
    } else {
      // Tolak dengan 409
      throw { 
        status: 409, 
        message: "Keranjang hanya boleh berisi produk dari 1 toko yang sama. Kosongkan keranjang saat ini?",
        code: "DIFFERENT_STORE" 
      };
    }
  } else if (!cart.storeId) {
    // Keranjang tadinya kosong, update storeId nya
    await prisma.cart.update({
      where: { id: cart.id },
      data: { storeId: product.storeId }
    });
  }

  // Tambahkan item ke keranjang
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } }
  });

  if (existingItem) {
    const newQty = existingItem.quantity + qty;
    if (newQty > product.stock) {
      throw { status: 400, message: "Total kuantitas melebihi stok yang tersedia" };
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: qty
      }
    });
  }

  return getCart(buyerId);
}

async function updateCartItem(buyerId, itemId, quantity) {
  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    throw { status: 400, message: "Kuantitas minimal 1" };
  }

  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (!cart) throw { status: 404, message: "Keranjang tidak ditemukan" };

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true }
  });

  if (!item || item.cartId !== cart.id) {
    throw { status: 404, message: "Item tidak ditemukan di keranjang" };
  }

  if (item.product.stock < qty) {
    throw { status: 400, message: "Stok produk tidak mencukupi" };
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: qty }
  });

  return getCart(buyerId);
}

async function removeCartItem(buyerId, itemId) {
  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (!cart) throw { status: 404, message: "Keranjang tidak ditemukan" };

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.cartId !== cart.id) {
    throw { status: 404, message: "Item tidak ditemukan di keranjang" };
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  // Cek apakah keranjang jadi kosong, kalau ya hapus storeId
  const remaining = await prisma.cartItem.count({ where: { cartId: cart.id } });
  if (remaining === 0) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { storeId: null }
    });
  }

  return getCart(buyerId);
}

async function clearCart(buyerId) {
  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({
      where: { id: cart.id },
      data: { storeId: null }
    });
  }
  return getCart(buyerId);
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
