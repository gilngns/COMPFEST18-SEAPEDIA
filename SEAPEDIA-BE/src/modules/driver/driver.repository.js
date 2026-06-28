const prisma = require("../../config/prisma");

class DriverRepository {
  async getDashboardStats(driverId) {
    const deliveries = await prisma.delivery.findMany({
      where: { driverId }
    });

    const activeDeliveries = deliveries.filter(d => !d.completedAt).length;
    const completedDeliveries = deliveries.filter(d => d.completedAt).length;
    const totalEarnings = deliveries.filter(d => d.earning).reduce((acc, curr) => acc + Number(curr.earning), 0);

    // Simulasi jarak acak untuk tiap delivery selesai (karena tidak ada GPS real)
    const totalDistance = completedDeliveries * Math.floor(Math.random() * 15 + 5); 

    const wallet = await prisma.wallet.findUnique({
      where: { userId: driverId }
    });

    return {
      activeDeliveries,
      completedDeliveries,
      totalEarnings,
      totalDistance,
      walletBalance: wallet ? Number(wallet.balance) : 0
    };
  }

  async getAvailableJobs() {
    return prisma.order.findMany({
      where: {
        status: "MENUNGGU_PENGIRIM",
        delivery: null
      },
      include: {
        store: { select: { name: true, address: true, city: true } },
        address: true,
        items: { include: { product: { select: { name: true, images: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getJobDetail(orderId) {
    const job = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: { select: { name: true, address: true, city: true } },
        address: true,
        items: { include: { product: { select: { name: true, images: true } } } }
      }
    });

    if (!job) {
      throw { status: 404, message: "Pesanan tidak ditemukan" };
    }

    return job;
  }

  async getMyDeliveries(driverId) {
    return prisma.delivery.findMany({
      where: { driverId },
      include: {
        order: {
          include: {
            store: { select: { name: true, address: true, city: true } },
            address: true,
            items: { include: { product: { select: { name: true, images: true } } } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async takeJob(driverId, orderId) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order || order.status !== "MENUNGGU_PENGIRIM") {
        throw { status: 400, message: "Pesanan tidak tersedia" };
      }

      const existingDelivery = await tx.delivery.findUnique({ where: { orderId } });
      if (existingDelivery) {
        throw { status: 400, message: "Pesanan sudah diambil driver lain" };
      }

      const delivery = await tx.delivery.create({
        data: {
          orderId,
          driverId,
          earning: order.deliveryFee,
          takenAt: new Date()
        }
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "SEDANG_DIKIRIM" }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "SEDANG_DIKIRIM",
          note: "Driver telah mengambil paket dan sedang dalam perjalanan"
        }
      });

      return delivery;
    });
  }

  async completeJob(driverId, orderId) {
    return prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.findUnique({
        where: { orderId },
        include: { order: true }
      });

      if (!delivery || delivery.driverId !== driverId || delivery.completedAt) {
        throw { status: 400, message: "Delivery tidak valid atau sudah selesai" };
      }

      const order = delivery.order;

      // 1. Update order & delivery status
      await tx.delivery.update({
        where: { id: delivery.id },
        data: { completedAt: new Date() }
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "PESANAN_SELESAI" }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "PESANAN_SELESAI",
          note: "Paket telah diterima oleh pembeli"
        }
      });

      // 2. Transfer funds to Seller
      // Seller gets (Subtotal - Discount) + PPN
      const sellerAmount = Number(order.subtotal) - Number(order.discount) + Number(order.ppn);
      const store = await tx.store.findUnique({ where: { id: order.storeId } });
      
      let sellerWallet = await tx.wallet.findUnique({ where: { userId: store.ownerId } });
      if (!sellerWallet) {
        sellerWallet = await tx.wallet.create({ data: { userId: store.ownerId } });
      }

      await tx.wallet.update({
        where: { id: sellerWallet.id },
        data: { balance: { increment: sellerAmount } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: sellerWallet.id,
          type: "EARNING",
          amount: sellerAmount,
          description: `Pendapatan pesanan #${order.id}`,
          orderId: order.id
        }
      });

      // 3. Transfer delivery fee to Driver
      let driverWallet = await tx.wallet.findUnique({ where: { userId: driverId } });
      if (!driverWallet) {
        driverWallet = await tx.wallet.create({ data: { userId: driverId } });
      }

      await tx.wallet.update({
        where: { id: driverWallet.id },
        data: { balance: { increment: delivery.earning } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: driverWallet.id,
          type: "EARNING",
          amount: delivery.earning,
          description: `Pendapatan pengiriman pesanan #${order.id}`,
          orderId: order.id
        }
      });

      return delivery;
    });
  }
}

module.exports = new DriverRepository();
