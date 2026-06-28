const buyerRepository = require("./buyer.repository");
const xss = require("xss");

class BuyerUseCase {
  
  async getWallet(userId) {
    let wallet = await buyerRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await buyerRepository.createWallet(userId);
    }
    return wallet;
  }

  async topUpWallet(userId, amount) {
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw { status: 400, message: "Nominal top-up harus lebih dari 0" };
    }

    const wallet = await this.getWallet(userId);
    return buyerRepository.topUpTransaction(wallet.id, amountNum);
  }

  async getWalletTransactions(userId) {
    const wallet = await this.getWallet(userId);
    return buyerRepository.getWalletTransactions(wallet.id);
  }

  
  async getAddresses(userId) {
    return buyerRepository.getAddressesByUserId(userId);
  }

  async addAddress(userId, { label, recipient, phone, detail, isDefault }) {
    if (!label || !recipient || !phone || !detail) {
      throw { status: 400, message: "Semua kolom alamat wajib diisi" };
    }

    if (isDefault) {
      await buyerRepository.unsetDefaultAddress(userId);
    }

    return buyerRepository.createAddress({
      userId,
      label,
      recipient,
      phone,
      detail,
      isDefault: Boolean(isDefault)
    });
  }

  async deleteAddress(userId, addressId) {
    const address = await buyerRepository.getAddressById(addressId);
    if (!address) throw { status: 404, message: "Alamat tidak ditemukan" };
    if (address.userId !== userId) throw { status: 403, message: "Bukan alamat Anda" };

    return buyerRepository.deleteAddress(addressId);
  }

  async setDefaultAddress(userId, addressId) {
    const address = await buyerRepository.getAddressById(addressId);
    if (!address) throw { status: 404, message: "Alamat tidak ditemukan" };
    if (address.userId !== userId) throw { status: 403, message: "Bukan alamat Anda" };

    await buyerRepository.setDefaultAddressTransaction(userId, addressId);

    return { message: "Alamat utama berhasil diubah" };
  }
  async submitReview(userId, orderId, reviews) {
    const order = await buyerRepository.getOrderByIdAndBuyer(orderId, userId);
    if (!order) {
      throw { status: 404, message: "Pesanan tidak ditemukan" };
    }
    if (order.status !== "PESANAN_SELESAI") {
      throw { status: 400, message: "Pesanan belum selesai, tidak dapat memberikan ulasan" };
    }

    const orderProductIds = order.items.map(item => item.productId);
    const reviewsData = [];

    for (const review of reviews) {
      if (!orderProductIds.includes(review.productId)) {
        throw { status: 400, message: `Produk dengan ID ${review.productId} tidak ada dalam pesanan ini` };
      }
      if (!review.rating || review.rating < 1 || review.rating > 5) {
        throw { status: 400, message: "Rating harus antara 1 sampai 5" };
      }

      reviewsData.push({
        productId: review.productId,
        buyerId: userId,
        orderId: orderId,
        rating: review.rating,
        comment: review.comment ? xss(review.comment) : ""
      });
    }

    try {
      await buyerRepository.createProductReviews(reviewsData);
      return { message: "Ulasan berhasil disimpan" };
    } catch (error) {
      if (error.code === 'P2002') {
        throw { status: 400, message: "Anda sudah memberikan ulasan untuk produk dalam pesanan ini" };
      }
      throw error;
    }
  }
}

module.exports = new BuyerUseCase();
