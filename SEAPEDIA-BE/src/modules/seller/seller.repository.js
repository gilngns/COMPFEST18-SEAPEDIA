const prisma = require("../../config/prisma");

class SellerRepository {
  async findStoreByName(name) {
    return prisma.store.findUnique({ where: { name } });
  }

  async findStoreByDomain(domain) {
    return prisma.store.findUnique({ where: { domain } });
  }

  async findStoreByOwner(ownerId) {
    return prisma.store.findUnique({ where: { ownerId } });
  }

  async updateStore(ownerId, data) {
    return prisma.store.update({
      where: { ownerId },
      data,
    });
  }

  async createStore(ownerId, data) {
    return prisma.store.create({
      data: { ...data, ownerId },
    });
  }

  async getMyStoreWithCount(ownerId) {
    return prisma.store.findUnique({
      where: { ownerId },
      include: { _count: { select: { products: true } } },
    });
  }

  async getPublicStore(storeId) {
    return prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true, name: true, description: true, createdAt: true,
        products: {
          where: { isActive: true },
          select: { id: true, name: true, price: true, stock: true, unit: true },
        },
      },
    });
  }

  async createProduct(data) {
    return prisma.product.create({ data });
  }

  async listProductsByStore(storeId) {
    return prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findProductById(productId) {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  async updateProduct(productId, data) {
    return prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async deactivateProduct(productId) {
    return prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  }
}

module.exports = new SellerRepository();
