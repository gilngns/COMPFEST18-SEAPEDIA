const prisma = require("../../config/prisma");

// ===================== WALLET =====================

async function getWallet(userId) {
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId, balance: 0 } });
  }
  return wallet;
}

async function topUpWallet(userId, amount) {
  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    throw { status: 400, message: "Nominal top-up harus lebih dari 0" };
  }

  const wallet = await getWallet(userId);

  // Gunakan transaksi agar atomic
  return prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amountNum } }
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "TOPUP",
        amount: amountNum,
        description: "Top-up saldo wallet"
      }
    });

    return updatedWallet;
  });
}

async function getWalletTransactions(userId) {
  const wallet = await getWallet(userId);
  return prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" }
  });
}

// ===================== ADDRESS =====================

async function getAddresses(userId) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" }
  });
}

async function addAddress(userId, { label, recipient, phone, detail, isDefault }) {
  if (!label || !recipient || !phone || !detail) {
    throw { status: 400, message: "Semua kolom alamat wajib diisi" };
  }

  // Jika isDefault true, unset isDefault dari alamat lama
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  return prisma.address.create({
    data: {
      userId,
      label,
      recipient,
      phone,
      detail,
      isDefault: Boolean(isDefault)
    }
  });
}

async function deleteAddress(userId, addressId) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) throw { status: 404, message: "Alamat tidak ditemukan" };
  if (address.userId !== userId) throw { status: 403, message: "Bukan alamat Anda" };

  return prisma.address.delete({ where: { id: addressId } });
}

async function setDefaultAddress(userId, addressId) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) throw { status: 404, message: "Alamat tidak ditemukan" };
  if (address.userId !== userId) throw { status: 403, message: "Bukan alamat Anda" };

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    })
  ]);

  return { message: "Alamat utama berhasil diubah" };
}

module.exports = {
  getWallet,
  topUpWallet,
  getWalletTransactions,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
};
