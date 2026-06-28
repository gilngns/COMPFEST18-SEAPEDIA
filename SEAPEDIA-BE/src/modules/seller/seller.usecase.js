const sellerRepository = require("./seller.repository");
const buyerRepository = require("../buyer/buyer.repository");
const xss = require("xss");

class SellerUseCase {
  async upsertStore(userId, { name, description, domain, slogan, logoUrl, isOpen, city, address }) {
    if (!name || !name.trim()) {
      throw { status: 400, message: "Nama toko wajib diisi" };
    }
    const cleanName = name.trim();
    const cleanDomain = domain?.trim() || null;

    const existing = await sellerRepository.findStoreByName(cleanName);
    if (existing && existing.ownerId !== userId) {
      throw { status: 409, message: "Nama toko sudah digunakan" };
    }
    
    if (cleanDomain) {
      const existingDomain = await sellerRepository.findStoreByDomain(cleanDomain);
      if (existingDomain && existingDomain.ownerId !== userId) {
        throw { status: 409, message: "Domain toko sudah digunakan" };
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

  async getMyStore(userId) {
    return sellerRepository.getMyStoreWithCount(userId);
  }

  async getPublicStore(storeId) {
    const store = await sellerRepository.getPublicStore(storeId);
    if (!store) throw { status: 404, message: "Toko tidak ditemukan" };
    return store;
  }

  
  async requireStore(userId) {
    const store = await sellerRepository.findStoreByOwner(userId);
    if (!store) throw { status: 400, message: "Buat toko dulu sebelum menambah produk" };
    return store;
  }

  validateProductInput({ name, price, stock }) {
    if (!name || !String(name).trim()) throw { status: 400, message: "Nama produk wajib diisi" };
    const p = Number(price);
    if (isNaN(p) || p < 0) throw { status: 400, message: "Harga harus angka >= 0" };
    const s = Number(stock);
    if (!Number.isInteger(s) || s < 0) throw { status: 400, message: "Stok harus bilangan bulat >= 0" };
  }

  async createProduct(userId, body) {
    const store = await this.requireStore(userId);
    this.validateProductInput(body);
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

  async listMyProducts(userId) {
    const store = await this.requireStore(userId);
    return sellerRepository.listProductsByStore(store.id);
  }

  async updateProduct(userId, productId, body) {
    const store = await this.requireStore(userId);
    const product = await sellerRepository.findProductById(productId);
    if (!product) throw { status: 404, message: "Produk tidak ditemukan" };
    if (product.storeId !== store.id) throw { status: 403, message: "Ini bukan produk toko kamu" };

    this.validateProductInput({
      name: body.name ?? product.name,
      price: body.price ?? product.price,
      stock: body.stock ?? product.stock,
    });

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

  async deleteProduct(userId, productId) {
    const store = await this.requireStore(userId);
    const product = await sellerRepository.findProductById(productId);
    if (!product) throw { status: 404, message: "Produk tidak ditemukan" };
    if (product.storeId !== store.id) throw { status: 403, message: "Ini bukan produk toko kamu" };

    return sellerRepository.deactivateProduct(productId);
  }

  async getWallet(userId) {
    let wallet = await buyerRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await buyerRepository.createWallet(userId);
    }
    return wallet;
  }

  async getWalletTransactions(userId) {
    const wallet = await this.getWallet(userId);
    return buyerRepository.getWalletTransactions(wallet.id);
  }

  async withdrawFunds(userId, amount) {
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw { status: 400, message: "Jumlah penarikan tidak valid" };
    }
    const wallet = await this.getWallet(userId);
    return buyerRepository.withdrawTransaction(wallet.id, amountNum);
  }
}

module.exports = new SellerUseCase();
