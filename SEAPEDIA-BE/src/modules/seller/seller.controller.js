const usecase = require("./seller.usecase");


async function upsertStore(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.logoUrl = `/uploads/products/${req.file.filename}`;
    if (data.isOpen !== undefined) {
      data.isOpen = data.isOpen === "true" || data.isOpen === true;
    }
    
    const result = await usecase.upsertStore(req.user.userId, data);
    res.json({ message: "Toko berhasil disimpan", data: result });
  } catch (err) {
    next(err);
  }
}

async function getMyStore(req, res, next) {
  try {
    const data = await usecase.getMyStore(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getPublicStore(req, res, next) {
  try {
    const data = await usecase.getPublicStore(req.params.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/products/${f.filename}`);
    }
    const product = await usecase.createProduct(req.user.userId, data);
    res.status(201).json({ message: "Produk ditambahkan", data: product });
  } catch (err) {
    next(err);
  }
}

async function listMyProducts(req, res, next) {
  try {
    const data = await usecase.listMyProducts(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/products/${f.filename}`);
    }
    const product = await usecase.updateProduct(req.user.userId, req.params.id, data);
    res.json({ message: "Produk diupdate", data: product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await usecase.deleteProduct(req.user.userId, req.params.id);
    res.json({ message: "Produk dinonaktifkan" });
  } catch (err) {
    next(err);
  }
}

async function getWallet(req, res, next) {
  try {
    const data = await usecase.getWallet(req.user.userId);
    res.json({ data });
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

async function withdrawFunds(req, res, next) {
  try {
    const data = await usecase.withdrawFunds(req.user.userId, req.body.amount);
    res.json({ message: "Penarikan dana berhasil", data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upsertStore,
  getMyStore,
  getPublicStore,
  createProduct,
  listMyProducts,
  updateProduct,
  deleteProduct,
  getWallet,
  getWalletTransactions,
  withdrawFunds,
};