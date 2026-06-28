const prisma = require("../../config/prisma");

class BuyerRepository {
  
  async getWalletByUserId(userId) {
    return prisma.wallet.findUnique({ where: { userId } });
  }

  async createWallet(userId) {
    return prisma.wallet.create({ data: { userId, balance: 0 } });
  }

  async topUpTransaction(walletId, amountNum) {
    return prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: amountNum } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: walletId,
          type: "TOPUP",
          amount: amountNum,
          description: "Top-up saldo wallet"
        }
      });

      return updatedWallet;
    });
  }

  async withdrawTransaction(walletId, amountNum) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!wallet || wallet.balance < amountNum) {
        throw { status: 400, message: "Saldo tidak mencukupi" };
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amountNum } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: walletId,
          type: "WITHDRAWAL",
          amount: -amountNum,
          description: "Penarikan dana ke rekening bank"
        }
      });

      return updatedWallet;
    });
  }

  async getWalletTransactions(walletId) {
    return prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" }
    });
  }

  
  async getAddressesByUserId(userId) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" }
    });
  }

  async unsetDefaultAddress(userId) {
    return prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  async createAddress(data) {
    return prisma.address.create({ data });
  }

  async getAddressById(id) {
    return prisma.address.findUnique({ where: { id } });
  }

  async deleteAddress(id) {
    return prisma.address.delete({ where: { id } });
  }

  async setDefaultAddressTransaction(userId, addressId) {
    return prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true }
      })
    ]);
  }
  async createProductReviews(reviewsData) {
    return prisma.productReview.createMany({
      data: reviewsData
    });
  }
  async getOrderByIdAndBuyer(orderId, buyerId) {
    return prisma.order.findFirst({
      where: { id: orderId, buyerId },
      include: { items: true }
    });
  }
}

module.exports = new BuyerRepository();
