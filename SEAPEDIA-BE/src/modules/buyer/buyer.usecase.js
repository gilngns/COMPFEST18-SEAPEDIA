const AppError = require("../../utils/AppError");
const buyerRepository = require("./buyer.repository");
const xss = require("xss");

const getWallet = async (userId) => {
    let wallet = await buyerRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await buyerRepository.createWallet(userId);
    }
    return wallet;
  }
const topUpWallet = async (userId, amount) => {
    const amountNum = Number(amount);


    const wallet = await getWallet(userId);
    return buyerRepository.topUpTransaction(wallet.id, amountNum);
  }
const getWalletTransactions = async (userId) => {
    const wallet = await getWallet(userId);
    return buyerRepository.getWalletTransactions(wallet.id);
  }
const getAddresses = async (userId) => {
    return buyerRepository.getAddressesByUserId(userId);
  }
const addAddress = async (userId, { label, recipient, phone, detail, isDefault }) => {

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
const deleteAddress = async (userId, addressId) => {
    const address = await buyerRepository.getAddressById(addressId);
    if (!address) throw new AppError("Alamat tidak ditemukan", 404);
    if (address.userId !== userId) throw new AppError("Bukan alamat Anda", 403);

    return buyerRepository.deleteAddress(addressId);
  }
const setDefaultAddress = async (userId, addressId) => {
    const address = await buyerRepository.getAddressById(addressId);
    if (!address) throw new AppError("Alamat tidak ditemukan", 404);
    if (address.userId !== userId) throw new AppError("Bukan alamat Anda", 403);

    await buyerRepository.setDefaultAddressTransaction(userId, addressId);

    return { message: "Alamat utama berhasil diubah" };
  }
const submitReview = async (userId, orderId, reviews) => {
    const order = await buyerRepository.getOrderByIdAndBuyer(orderId, userId);
    if (!order) {
      throw new AppError("Pesanan tidak ditemukan", 404);
    }
    if (order.status !== "PESANAN_SELESAI") {
      throw new AppError("Pesanan belum selesai, tidak dapat memberikan ulasan", 400);
    }

    const orderProductIds = order.items.map(item => item.productId);
    const reviewsData = [];

    for (const review of reviews) {
      if (!orderProductIds.includes(review.productId)) {
        throw new AppError(`Produk dengan ID ${review.productId} tidak ada dalam pesanan ini`, 400);
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
        throw new AppError("Anda sudah memberikan ulasan untuk produk dalam pesanan ini", 400);
      }
      throw error;
    }
  }

module.exports = { getWallet, topUpWallet, getWalletTransactions, getAddresses, addAddress, deleteAddress, setDefaultAddress, submitReview };

