const prisma = require("../../config/prisma");

const getCart = async (buyerId) => {
    return prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                images: true,
                store: {
                  select: { id: true, name: true }
                }
              }
            }
          },
          orderBy: { id: "asc" }
        }
      }
    });
  }
const createCart = async (buyerId) => {
    return prisma.cart.create({
      data: { buyerId },
      include: { items: true }
    });
  }
const findProduct = async (productId) => {
    return prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: { store: true }
    });
  }
const clearCartItems = async (cartId) => {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
const updateCartStore = async (cartId, storeId) => {
    return prisma.cart.update({
      where: { id: cartId },
      data: { storeId }
    });
  }
const findCartItem = async (cartId, productId) => {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } }
    });
  }
const updateCartItemQuantity = async (itemId, quantity) => {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }
const createCartItem = async (cartId, productId, quantity) => {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity
      }
    });
  }
const getCartItemWithProduct = async (itemId) => {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });
  }
const getCartItemById = async (itemId) => {
    return prisma.cartItem.findUnique({ where: { id: itemId } });
  }
const deleteCartItem = async (itemId) => {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }
const countCartItems = async (cartId) => {
    return prisma.cartItem.count({ where: { cartId } });
  }

module.exports = { getCart, createCart, findProduct, clearCartItems, updateCartStore, findCartItem, updateCartItemQuantity, createCartItem, getCartItemWithProduct, getCartItemById, deleteCartItem, countCartItems };

