const prisma = require("../../config/prisma");

const DELIVERY_FEES = {
  INSTANT: 25000,
  NEXT_DAY: 15000,
  REGULAR: 10000,
};

async function previewCheckout(buyerId) {
  const cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: { include: { product: true } }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw { status: 400, message: "Keranjang kosong" };
  }

  const subtotal = cart.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const ppn = subtotal * 0.12;

  return {
    subtotal,
    ppn,
    storeId: cart.storeId,
    items: cart.items.map(i => ({
      productId: i.productId,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: Number(i.product.price) * i.quantity
    }))
  };
}

async function checkout(buyerId, { addressId, deliveryMethod }) {
  if (!addressId) throw { status: 400, message: "Alamat pengiriman wajib dipilih" };
  if (!DELIVERY_FEES[deliveryMethod]) throw { status: 400, message: "Metode pengiriman tidak valid" };

  const cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: { include: { product: true } }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw { status: 400, message: "Keranjang kosong" };
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== buyerId) {
    throw { status: 404, message: "Alamat tidak valid" };
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: buyerId } });
  if (!wallet) throw { status: 400, message: "Wallet belum aktif" };

  const subtotal = cart.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const ppn = subtotal * 0.12;
  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  const total = subtotal + ppn + deliveryFee;

  if (Number(wallet.balance) < total) {
    throw { status: 400, message: "Saldo wallet tidak mencukupi" };
  }

  // Gunakan transaksi untuk atomic
  return prisma.$transaction(async (tx) => {
    // 1. Buat Order
    const order = await tx.order.create({
      data: {
        buyerId,
        storeId: cart.storeId,
        addressId,
        subtotal,
        deliveryFee,
        ppn,
        total,
        deliveryMethod,
        status: "SEDANG_DIKEMAS",
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        },
        statusHistory: {
          create: { status: "SEDANG_DIKEMAS", note: "Pesanan dibuat dan dibayar" }
        }
      }
    });

    // 2. Potong saldo buyer
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: total } }
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PAYMENT",
        amount: total,
        description: `Pembayaran pesanan #${order.id}`,
        orderId: order.id
      }
    });

    // 3. Potong stok produk
    for (const item of cart.items) {
      const p = await tx.product.findUnique({ where: { id: item.productId } });
      if (p.stock < item.quantity) {
        throw { status: 400, message: `Stok produk ${p.name} tidak mencukupi` };
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // 4. Kosongkan keranjang
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { storeId: null } });

    return order;
  });
}

// Untuk Buyer
async function getMyOrders(buyerId) {
  return prisma.order.findMany({
    where: { buyerId },
    include: {
      store: { select: { id: true, name: true } },
      items: { include: { product: { select: { name: true, images: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
}

// Untuk Seller
async function getStoreOrders(sellerId) {
  const store = await prisma.store.findUnique({ where: { ownerId: sellerId } });
  if (!store) throw { status: 404, message: "Toko tidak ditemukan" };

  return prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      buyer: { select: { id: true, username: true } },
      items: { include: { product: { select: { name: true, images: true } } } },
      address: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateOrderStatus(sellerId, orderId, status) {
  const store = await prisma.store.findUnique({ where: { ownerId: sellerId } });
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.storeId !== store.id) {
    throw { status: 404, message: "Pesanan tidak ditemukan atau bukan milik toko Anda" };
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status }
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note: `Status diupdate oleh seller menjadi ${status}`
      }
    });

    return updated;
  });
}

module.exports = {
  previewCheckout,
  checkout,
  getMyOrders,
  getStoreOrders,
  updateOrderStatus
};
