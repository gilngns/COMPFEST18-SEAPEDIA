const AppError = require("../../utils/AppError");
const sellerRepository = require("./seller.repository");
const buyerRepository = require("../buyer/buyer.repository");
const xss = require("xss");

const upsertStore = async (userId, { name, description, domain, slogan, logoUrl, isOpen, city, address }) => {
    const cleanName = name.trim();
    const cleanDomain = domain?.trim() || null;

    const existing = await sellerRepository.findStoreByName(cleanName);
    if (existing && existing.ownerId !== userId) {
      throw new AppError("Nama toko sudah digunakan", 409);
    }
    
    if (cleanDomain) {
      const existingDomain = await sellerRepository.findStoreByDomain(cleanDomain);
      if (existingDomain && existingDomain.ownerId !== userId) {
        throw new AppError("Domain toko sudah digunakan", 409);
      }
    }

    const data = {
      name: xss(cleanName),
      description: description ? xss(description) : null,
      domain: cleanDomain,
      slogan: slogan ? xss(slogan.trim()) : null,
      city: city?.trim() || null,
      address: address?.trim() || null,
    };
    
    if (logoUrl !== undefined) data.logoUrl = logoUrl;
    if (isOpen !== undefined) data.isOpen = isOpen;

    const myStore = await sellerRepository.findStoreByOwner(userId);
    if (myStore) {
      return sellerRepository.updateStore(userId, data);
    }
    return sellerRepository.createStore(userId, data);
  }
const getMyStore = async (userId) => {
    return sellerRepository.getMyStoreWithCount(userId);
  }
const getPublicStore = async (storeId) => {
    const store = await sellerRepository.getPublicStore(storeId);
    if (!store) throw new AppError("Toko tidak ditemukan", 404);
    return store;
  }
const requireStore = async (userId) => {
    const store = await sellerRepository.findStoreByOwner(userId);
    if (!store) throw new AppError("Buat toko dulu sebelum menambah produk", 400);
    return store;
  }

const createProduct = async (userId, body) => {
    const store = await requireStore(userId);
    return sellerRepository.createProduct({
      storeId: store.id,
      name: xss(body.name.trim()),
      description: body.description ? xss(body.description) : null,
      price: Number(body.price),
      stock: Number(body.stock),
      unit: body.unit ? xss(body.unit) : "pcs",
      images: body.images || [],
    });
  }
const listMyProducts = async (userId) => {
    const store = await requireStore(userId);
    return sellerRepository.listProductsByStore(store.id);
  }
const updateProduct = async (userId, productId, body) => {
    const store = await requireStore(userId);
    const product = await sellerRepository.findProductById(productId);
    if (!product) throw new AppError("Produk tidak ditemukan", 404);
    if (product.storeId !== store.id) throw new AppError("Ini bukan produk toko kamu", 403);

    return sellerRepository.updateProduct(productId, {
      name: body.name ? xss(body.name.trim()) : product.name,
      description: body.description ? xss(body.description) : product.description,
      price: body.price != null ? Number(body.price) : product.price,
      stock: body.stock != null ? Number(body.stock) : product.stock,
      unit: body.unit !== undefined ? xss(body.unit) : product.unit,
      isActive: body.isActive != null ? body.isActive : product.isActive,
      images: body.images !== undefined ? body.images : product.images,
    });
  }
const deleteProduct = async (userId, productId) => {
    const store = await requireStore(userId);
    const product = await sellerRepository.findProductById(productId);
    if (!product) throw new AppError("Produk tidak ditemukan", 404);
    if (product.storeId !== store.id) throw new AppError("Ini bukan produk toko kamu", 403);

    return sellerRepository.deactivateProduct(productId);
  }
const getWallet = async (userId) => {
    let wallet = await buyerRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await buyerRepository.createWallet(userId);
    }
    return wallet;
  }
const getWalletTransactions = async (userId) => {
    const wallet = await getWallet(userId);
    return buyerRepository.getWalletTransactions(wallet.id);
  }
const withdrawFunds = async (userId, amount) => {
    const amountNum = Number(amount);
    
    const wallet = await getWallet(userId);
    return buyerRepository.withdrawTransaction(wallet.id, amountNum);
  }

module.exports = { upsertStore, getMyStore, getPublicStore, requireStore, createProduct, listMyProducts, updateProduct, deleteProduct, getWallet, getWalletTransactions, withdrawFunds };


