const prisma = require("../../config/prisma");
const { getSimulatedDate } = require("../../utils/clock");

const getCartForCheckout = async (buyerId) => {
    return prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: { include: { product: true } }
      }
    });
  }
const getAddress = async (addressId) => {
    return prisma.address.findUnique({ where: { id: addressId } });
  }
const getWallet = async (buyerId) => {
    return prisma.wallet.findUnique({ where: { userId: buyerId } });
  }
const getStoreByOwner = async (sellerId) => {
    return prisma.store.findUnique({ where: { ownerId: sellerId } });
  }
const getOrder = async (orderId) => {
    return prisma.order.findUnique({ where: { id: orderId } });
  }
const executeCheckoutTransaction = async ({ buyerId, cart, addressId, subtotal, discountAmount, deliveryFee, ppn, total, deliveryMethod, walletId, voucherId, promoId }) => {
    const now = await getSimulatedDate();
    const slaDeadline = new Date(now);
    if (deliveryMethod === "INSTANT") {
      slaDeadline.setDate(slaDeadline.getDate() + 1);
    } else if (deliveryMethod === "NEXT_DAY") {
      slaDeadline.setDate(slaDeadline.getDate() + 2);
    } else {
      slaDeadline.setDate(slaDeadline.getDate() + 5);
    }

    return prisma.$transaction(async (tx) => {
      
      const order = await tx.order.create({
        data: {
          buyerId,
          storeId: cart.storeId,
          addressId,
          subtotal,
          discount: discountAmount,
          deliveryFee,
          ppn,
          total,
          deliveryMethod,
          voucherId,
          promoId,
          slaDeadline,
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

      
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: total } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: walletId,
          type: "PAYMENT",
          amount: total,
          description: `Pembayaran pesanan #${order.id}`,
          orderId: order.id
        }
      });

      
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

      if (voucherId) {
        await tx.voucher.update({
          where: { id: voucherId },
          data: { remainingUsage: { decrement: 1 } }
        });
      }

      
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { storeId: null } });

      return order;
    });
  }
const getMyOrders = async (buyerId) => {
    return prisma.order.findMany({
      where: { buyerId },
      include: {
        store: { select: { id: true, name: true } },
        address: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        items: { include: { product: { select: { name: true, images: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
  }
const getStoreOrders = async (storeId) => {
    return prisma.order.findMany({
      where: { storeId },
      include: {
        buyer: { select: { id: true, username: true } },
        items: { include: { product: { select: { name: true, images: true } } } },
        address: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
const updateOrderStatusWithHistory = async (orderId, status) => {
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

module.exports = { getCartForCheckout, getAddress, getWallet, getStoreByOwner, getOrder, executeCheckoutTransaction, getMyOrders, getStoreOrders, updateOrderStatusWithHistory };

