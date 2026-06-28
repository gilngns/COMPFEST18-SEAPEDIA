const usecase = require("./buyer.usecase");



async function getWallet(req, res, next) {
  try {
    const data = await usecase.getWallet(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function topUpWallet(req, res, next) {
  try {
    const { amount } = req.body;
    const data = await usecase.topUpWallet(req.user.userId, amount);
    res.json({ message: "Top-up berhasil", data });
  } catch (err) {
    next(err);
  }
}

async function getWalletTransactions(req, res, next) {
  try {
    const data = await usecase.getWalletTransactions(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}



async function getAddresses(req, res, next) {
  try {
    const data = await usecase.getAddresses(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const data = await usecase.addAddress(req.user.userId, req.body);
    res.status(201).json({ message: "Alamat ditambahkan", data });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    await usecase.deleteAddress(req.user.userId, req.params.id);
    res.json({ message: "Alamat dihapus" });
  } catch (err) {
    next(err);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const data = await usecase.setDefaultAddress(req.user.userId, req.params.id);
    res.json(data); 
  } catch (err) {
    next(err);
  }
}

async function submitReview(req, res, next) {
  try {
    const { id } = req.params; 
    const { reviews } = req.body;
    const data = await usecase.submitReview(req.user.userId, id, reviews);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWallet,
  topUpWallet,
  getWalletTransactions,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  submitReview
};
