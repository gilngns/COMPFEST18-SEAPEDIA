const prisma = require("../../config/prisma");

async function upsertStore(userId, { name, description, domain, slogan, logoUrl, isOpen }) {
  if (!name || !name.trim()) {
    throw { status: 400, message: "Nama toko wajib diisi" };
  }
  const cleanName = name.trim();
  const cleanDomain = domain?.trim() || null;

  const existing = await prisma.store.findUnique({ where: { name: cleanName } });
  if (existing && existing.ownerId !== userId) {
    throw { status: 409, message: "Nama toko sudah digunakan" };
  }
  
  if (cleanDomain) {
    const existingDomain = await prisma.store.findUnique({ where: { domain: cleanDomain } });
    if (existingDomain && existingDomain.ownerId !== userId) {
      throw { status: 409, message: "Domain toko sudah digunakan" };
    }
  }

  const data = {
    name: cleanName,
    description: description || null,
    domain: cleanDomain,
    slogan: slogan?.trim() || null,
  };
  
  if (logoUrl !== undefined) data.logoUrl = logoUrl;
  if (isOpen !== undefined) data.isOpen = isOpen;

  const myStore = await prisma.store.findUnique({ where: { ownerId: userId } });
  if (myStore) {
    return prisma.store.update({
      where: { ownerId: userId },
      data,
    });
  }
  return prisma.store.create({
    data: { ...data, ownerId: userId },
  });
}

async function getMyStore(userId) {
  return prisma.store.findUnique({
    where: { ownerId: userId },
    include: { _count: { select: { products: true } } },
  });
}

async function getPublicStore(storeId) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true, name: true, description: true, createdAt: true,
      products: {
        where: { isActive: true },
        select: { id: true, name: true, price: true, stock: true, unit: true },
      },
    },
  });
  if (!store) throw { status: 404, message: "Toko tidak ditemukan" };
  return store;
}

// ===================== PRODUCT =====================
async function requireStore(userId) {
  const store = await prisma.store.findUnique({ where: { ownerId: userId } });
  if (!store) throw { status: 400, message: "Buat toko dulu sebelum menambah produk" };
  return store;
}

function validateProductInput({ name, price, stock }) {
  if (!name || !String(name).trim()) throw { status: 400, message: "Nama produk wajib diisi" };
  const p = Number(price);
  if (isNaN(p) || p < 0) throw { status: 400, message: "Harga harus angka >= 0" };
  const s = Number(stock);
  if (!Number.isInteger(s) || s < 0) throw { status: 400, message: "Stok harus bilangan bulat >= 0" };
}

async function createProduct(userId, body) {
  const store = await requireStore(userId);
  validateProductInput(body);
  return prisma.product.create({
    data: {
      storeId: store.id,
      name: body.name.trim(),
      description: body.description || null,
      price: Number(body.price),
      stock: Number(body.stock),
      unit: body.unit || "pcs",
      imageUrl: body.imageUrl || null,
    },
  });
}

async function listMyProducts(userId) {
  const store = await requireStore(userId);
  return prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });
}

async function updateProduct(userId, productId, body) {
  const store = await requireStore(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { status: 404, message: "Produk tidak ditemukan" };
  if (product.storeId !== store.id) throw { status: 403, message: "Ini bukan produk toko kamu" };

  validateProductInput({
    name: body.name ?? product.name,
    price: body.price ?? product.price,
    stock: body.stock ?? product.stock,
  });

  return prisma.product.update({
    where: { id: productId },
    data: {
      name: body.name?.trim() ?? product.name,
      description: body.description ?? product.description,
      price: body.price != null ? Number(body.price) : product.price,
      stock: body.stock != null ? Number(body.stock) : product.stock,
      unit: body.unit !== undefined ? body.unit : product.unit,
      isActive: body.isActive != null ? body.isActive : product.isActive,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : product.imageUrl,
    },
  });
}

async function deleteProduct(userId, productId) {
  const store = await requireStore(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { status: 404, message: "Produk tidak ditemukan" };
  if (product.storeId !== store.id) throw { status: 403, message: "Ini bukan produk toko kamu" };

  return prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });
}

module.exports = {
  upsertStore, getMyStore, getPublicStore,
  createProduct, listMyProducts, updateProduct, deleteProduct,
};