const prisma = require("../../config/prisma");

const findStoreByName = async (name) => {
    return prisma.store.findUnique({ where: { name } });
  }
const findStoreByDomain = async (domain) => {
    return prisma.store.findUnique({ where: { domain } });
  }
const findStoreByOwner = async (ownerId) => {
    return prisma.store.findUnique({ where: { ownerId } });
  }
const updateStore = async (ownerId, data) => {
    return prisma.store.update({
      where: { ownerId },
      data,
    });
  }
const createStore = async (ownerId, data) => {
    return prisma.store.create({
      data: { ...data, ownerId },
    });
  }
const getMyStoreWithCount = async (ownerId) => {
    return prisma.store.findUnique({
      where: { ownerId },
      include: { _count: { select: { products: true } } },
    });
  }
const getPublicStore = async (storeId) => {
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
const createProduct = async (data) => {
    return prisma.product.create({ data });
  }
const listProductsByStore = async (storeId) => {
    return prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }
const findProductById = async (productId) => {
    return prisma.product.findUnique({ where: { id: productId } });
  }
const updateProduct = async (productId, data) => {
    return prisma.product.update({
      where: { id: productId },
      data,
    });
  }
const deactivateProduct = async (productId) => {
    return prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  }

module.exports = { findStoreByName, findStoreByDomain, findStoreByOwner, updateStore, createStore, getMyStoreWithCount, getPublicStore, createProduct, listProductsByStore, findProductById, updateProduct, deactivateProduct };

