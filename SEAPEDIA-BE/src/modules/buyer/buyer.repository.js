const prisma = require("../../config/prisma");

const getWalletByUserId = async (userId) => {
    return prisma.wallet.findUnique({ where: { userId } });
  }
const createWallet = async (userId) => {
    return prisma.wallet.create({ data: { userId, balance: 0 } });
  }
const topUpTransaction = async (walletId, amountNum) => {
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
const withdrawTransaction = async (walletId, amountNum) => {
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
const getWalletTransactions = async (walletId) => {
    return prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" }
    });
  }
const getAddressesByUserId = async (userId) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" }
    });
  }
const unsetDefaultAddress = async (userId) => {
    return prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }
const createAddress = async (data) => {
    return prisma.address.create({ data });
  }
const getAddressById = async (id) => {
    return prisma.address.findUnique({ where: { id } });
  }
const deleteAddress = async (id) => {
    return prisma.address.delete({ where: { id } });
  }
const setDefaultAddressTransaction = async (userId, addressId) => {
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
const createProductReviews = async (reviewsData) => {
    return prisma.productReview.createMany({
      data: reviewsData
    });
  }
const getOrderByIdAndBuyer = async (orderId, buyerId) => {
    return prisma.order.findFirst({
      where: { id: orderId, buyerId },
      include: { items: true }
    });
  }

module.exports = { getWalletByUserId, createWallet, topUpTransaction, withdrawTransaction, getWalletTransactions, getAddressesByUserId, unsetDefaultAddress, createAddress, getAddressById, deleteAddress, setDefaultAddressTransaction, createProductReviews, getOrderByIdAndBuyer };

