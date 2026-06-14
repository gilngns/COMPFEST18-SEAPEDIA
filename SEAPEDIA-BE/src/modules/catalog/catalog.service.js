const prisma = require("../../config/prisma");

async function listProducts({ search } = {}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      store: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getProduct(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      isActive: true,
      store: { select: { id: true, name: true, description: true } },
    },
  });
  if (!product || !product.isActive) {
    throw { status: 404, message: "Produk tidak ditemukan" };
  }
  return product;
}

module.exports = { listProducts, getProduct };