const prisma = require("../../config/prisma");

class AdminRepository {
  async createVoucher(data) {
    return prisma.voucher.create({ data });
  }

  async createPromo(data) {
    return prisma.promo.create({ data });
  }

  async getVouchers() {
    return prisma.voucher.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getOrders() {
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { username: true, email: true } },
        store: { select: { name: true } },
        items: {
          include: {
            product: { select: { name: true, images: true } }
          }
        }
      }
    });
  }

  async getPromos() {
    return prisma.promo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getDashboardStats() {
    const [
      users,
      stores,
      products,
      orders,
      vouchers,
      promos,
      deliveries,
      overdueOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.voucher.count(),
      prisma.promo.count(),
      prisma.delivery.count(),
      prisma.order.count({ where: { status: 'DIKEMBALIKAN' } })
    ]);

    const completedOrders = await prisma.order.findMany({
      where: { status: "PESANAN_SELESAI" },
      select: { total: true }
    });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);

    return {
      users,
      stores,
      products,
      orders,
      vouchers,
      promos,
      deliveries,
      overdueOrders,
      totalRevenue
    };
  }

  async incrementDayOffset() {
    return prisma.systemClock.upsert({
      where: { id: 1 },
      update: { dayOffset: { increment: 1 } },
      create: { id: 1, dayOffset: 1 }
    });
  }

  async processOverdueOrders(simulatedNow) {
    const overdueOrders = await prisma.order.findMany({
      where: {
        slaDeadline: { lt: simulatedNow },
        status: { notIn: ["PESANAN_SELESAI", "DIKEMBALIKAN"] }
      },
      include: {
        items: true,
        buyer: { select: { id: true, wallet: true } }
      }
    });

    let refundedCount = 0;

    for (const order of overdueOrders) {
      await prisma.$transaction(async (tx) => {
        
        await tx.order.update({
          where: { id: order.id },
          data: { status: "DIKEMBALIKAN" }
        });

        
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "DIKEMBALIKAN",
            note: "Batas waktu pengiriman berakhir (SLA Overdue). Dana dikembalikan otomatis."
          }
        });

        
        let buyerWallet = await tx.wallet.findUnique({ where: { userId: order.buyerId } });
        if (!buyerWallet) {
          buyerWallet = await tx.wallet.create({ data: { userId: order.buyerId, balance: 0 } });
        }

        await tx.wallet.update({
          where: { id: buyerWallet.id },
          data: { balance: { increment: order.total } }
        });

        await tx.walletTransaction.create({
          data: {
            walletId: buyerWallet.id,
            type: "REFUND",
            amount: order.total,
            description: `Auto-Refund pesanan #${order.id} karena melewati batas waktu SLA`,
            orderId: order.id
          }
        });

        
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      });
      refundedCount++;
    }

    return refundedCount;
  }
}

module.exports = new AdminRepository();
