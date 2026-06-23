const service = require("./buyer.service");

// ===================== WALLET =====================

async function getWallet(req, res, next) {
  try {
    const wallet = await service.getWallet(req.user.userId);
    res.json({ data: wallet });
  } catch (err) {
    next(err);
  }
}

async function topUpWallet(req, res, next) {
  try {
    const { amount } = req.body;
    const wallet = await service.topUpWallet(req.user.userId, amount);
    res.json({ message: "Top up berhasil", data: wallet });
  } catch (err) {
    next(err);
  }
}

async function getWalletTransactions(req, res, next) {
  try {
    const transactions = await service.getWalletTransactions(req.user.userId);
    res.json({ data: transactions });
  } catch (err) {
    next(err);
  }
}

// ===================== ADDRESS =====================

async function getAddresses(req, res, next) {
  try {
    const addresses = await service.getAddresses(req.user.userId);
    res.json({ data: addresses });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const address = await service.addAddress(req.user.userId, req.body);
    res.status(201).json({ message: "Alamat berhasil ditambahkan", data: address });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    await service.deleteAddress(req.user.userId, req.params.id);
    res.json({ message: "Alamat berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const result = await service.setDefaultAddress(req.user.userId, req.params.id);
    res.json(result);
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
  setDefaultAddress
};
