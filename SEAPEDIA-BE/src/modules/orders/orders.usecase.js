const AppError = require("../../utils/AppError");
const ordersRepository = require("./orders.repository");
const discountUsecase = require("../discount/discount.usecase");

const DELIVERY_FEES = {
  INSTANT: 25000,
  NEXT_DAY: 15000,
  REGULAR: 10000,
};

const previewCheckout = async (buyerId, discountCode) => {
    const cart = await ordersRepository.getCartForCheckout(buyerId);

    if (!cart || cart.items.length === 0) {
      throw new AppError("Keranjang kosong", 400);
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
const checkout = async (buyerId, { addressId, deliveryMethod, discountCode }) => {
    const cart = await ordersRepository.getCartForCheckout(buyerId);

    if (!cart || cart.items.length === 0) {
      throw new AppError("Keranjang kosong", 400);
    }

    const address = await ordersRepository.getAddress(addressId);
    if (!address || address.userId !== buyerId) {
      throw new AppError("Alamat tidak valid", 404);
    }

    const wallet = await ordersRepository.getWallet(buyerId);
    if (!wallet) throw new AppError("Wallet belum aktif", 400);

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
      throw new AppError("Saldo wallet tidak mencukupi", 400);
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
const getMyOrders = async (buyerId) => {
    return ordersRepository.getMyOrders(buyerId);
  }
const getStoreOrders = async (sellerId) => {
    const store = await ordersRepository.getStoreByOwner(sellerId);
    if (!store) throw new AppError("Toko tidak ditemukan", 404);

    return ordersRepository.getStoreOrders(store.id);
  }
const updateOrderStatus = async (sellerId, orderId, status) => {
    const store = await ordersRepository.getStoreByOwner(sellerId);
    if (!store) throw new AppError("Toko tidak ditemukan", 404);
    
    const order = await ordersRepository.getOrder(orderId);

    if (!order || order.storeId !== store.id) {
      throw new AppError("Pesanan tidak ditemukan atau bukan milik toko Anda", 404);
    }

    return ordersRepository.updateOrderStatusWithHistory(orderId, status);
  }

module.exports = { previewCheckout, checkout, getMyOrders, getStoreOrders, updateOrderStatus };

