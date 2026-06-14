const service = require("./seller.service");

// STORE
async function upsertStore(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.logoUrl = `/uploads/products/${req.file.filename}`; // reusing products folder for simplicity, or we can just say /uploads/
    
    // Convert isOpen to boolean if it's sent as a string from FormData
    if (data.isOpen !== undefined) {
      data.isOpen = data.isOpen === "true" || data.isOpen === true;
    }

    const store = await service.upsertStore(req.user.userId, data);
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
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/products/${req.file.filename}`;
    const product = await service.createProduct(req.user.userId, data);
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
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/products/${req.file.filename}`;
    const product = await service.updateProduct(req.user.userId, req.params.id, data);
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