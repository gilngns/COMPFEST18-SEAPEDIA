const service = require("./seller.service");

// STORE
async function upsertStore(req, res, next) {
  try {
    const store = await service.upsertStore(req.user.userId, req.body);
    res.json({ message: "Toko tersimpan", data: store });
  } catch (err) { next(err); }
}
async function myStore(req, res, next) {
  try {
    const store = await service.getMyStore(req.user.userId);
    res.json({ data: store });
  } catch (err) { next(err); }
}
async function publicStore(req, res, next) {
  try {
    const store = await service.getPublicStore(req.params.id);
    res.json({ data: store });
  } catch (err) { next(err); }
}

// PRODUCT
async function createProduct(req, res, next) {
  try {
    const product = await service.createProduct(req.user.userId, req.body);
    res.status(201).json({ message: "Produk dibuat", data: product });
  } catch (err) { next(err); }
}
async function listMyProducts(req, res, next) {
  try {
    const products = await service.listMyProducts(req.user.userId);
    res.json({ data: products });
  } catch (err) { next(err); }
}
async function updateProduct(req, res, next) {
  try {
    const product = await service.updateProduct(req.user.userId, req.params.id, req.body);
    res.json({ message: "Produk diperbarui", data: product });
  } catch (err) { next(err); }
}
async function deleteProduct(req, res, next) {
  try {
    await service.deleteProduct(req.user.userId, req.params.id);
    res.json({ message: "Produk dinonaktifkan" });
  } catch (err) { next(err); }
}

module.exports = {
  upsertStore, myStore, publicStore,
  createProduct, listMyProducts, updateProduct, deleteProduct,
};