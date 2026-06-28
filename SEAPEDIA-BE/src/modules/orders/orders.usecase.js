const ordersRepository = require("./orders.repository");
const discountUsecase = require("../discount/discount.usecase");

const DELIVERY_FEES = {
  INSTANT: 25000,
  NEXT_DAY: 15000,
  REGULAR: 10000,
};

class OrdersUseCase {
  async previewCheckout(buyerId, discountCode) {
    const cart = await ordersRepository.getCartForCheckout(buyerId);

    if (!cart || cart.items.length === 0) {
      throw { status: 400, message: "Keranjang kosong" };
    }

    const subtotal = cart.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
    
    let discountAmount = 0;
    let discountData = null;

    if (discountCode) {
      try {
        const d = await discountUsecase.validateDiscount(discountCode);
        discountData = d.data;
        if (d.data.isPercent) {
          discountAmount = subtotal * (Number(d.data.amount) / 100);
        } else {
          discountAmount = Number(d.data.amount);
        }
        if (discountAmount > subtotal) discountAmount = subtotal;
      } catch (err) {
        
        throw err;
      }
    }

    const ppn = subtotal * 0.12;

    return {
      subtotal,
      discount: discountAmount,
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

  async checkout(buyerId, { addressId, deliveryMethod, discountCode }) {
    if (!addressId) throw { status: 400, message: "Alamat pengiriman wajib dipilih" };
    if (!DELIVERY_FEES[deliveryMethod]) throw { status: 400, message: "Metode pengiriman tidak valid" };

    const cart = await ordersRepository.getCartForCheckout(buyerId);

    if (!cart || cart.items.length === 0) {
      throw { status: 400, message: "Keranjang kosong" };
    }

    const address = await ordersRepository.getAddress(addressId);
    if (!address || address.userId !== buyerId) {
      throw { status: 404, message: "Alamat tidak valid" };
    }

    const wallet = await ordersRepository.getWallet(buyerId);
    if (!wallet) throw { status: 400, message: "Wallet belum aktif" };

    const subtotal = cart.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
    
    let discountAmount = 0;
    let voucherId = null;
    let promoId = null;

    if (discountCode) {
      const d = await discountUsecase.validateDiscount(discountCode);
      if (d.type === "VOUCHER") voucherId = d.data.id;
      if (d.type === "PROMO") promoId = d.data.id;

      if (d.data.isPercent) {
        discountAmount = subtotal * (Number(d.data.amount) / 100);
      } else {
        discountAmount = Number(d.data.amount);
      }
      if (discountAmount > subtotal) discountAmount = subtotal;
    }

    const ppn = subtotal * 0.12;
    const deliveryFee = DELIVERY_FEES[deliveryMethod];
    const total = subtotal - discountAmount + ppn + deliveryFee;

    if (Number(wallet.balance) < total) {
      throw { status: 400, message: "Saldo wallet tidak mencukupi" };
    }

    return ordersRepository.executeCheckoutTransaction({
      buyerId,
      cart,
      addressId,
      subtotal,
      discountAmount,
      deliveryFee,
      ppn,
      total,
      deliveryMethod,
      walletId: wallet.id,
      voucherId,
      promoId
    });
  }

  async getMyOrders(buyerId) {
    return ordersRepository.getMyOrders(buyerId);
  }

  async getStoreOrders(sellerId) {
    const store = await ordersRepository.getStoreByOwner(sellerId);
    if (!store) throw { status: 404, message: "Toko tidak ditemukan" };

    return ordersRepository.getStoreOrders(store.id);
  }

  async updateOrderStatus(sellerId, orderId, status) {
    const store = await ordersRepository.getStoreByOwner(sellerId);
    if (!store) throw { status: 404, message: "Toko tidak ditemukan" };
    
    const order = await ordersRepository.getOrder(orderId);

    if (!order || order.storeId !== store.id) {
      throw { status: 404, message: "Pesanan tidak ditemukan atau bukan milik toko Anda" };
    }

    return ordersRepository.updateOrderStatusWithHistory(orderId, status);
  }
}

module.exports = new OrdersUseCase();
