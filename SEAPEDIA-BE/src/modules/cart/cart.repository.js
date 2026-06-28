const prisma = require("../../config/prisma");

class CartRepository {
  async getCart(buyerId) {
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

  async createCart(buyerId) {
    return prisma.cart.create({
      data: { buyerId },
      include: { items: true }
    });
  }

  async findProduct(productId) {
    return prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: { store: true }
    });
  }

  async clearCartItems(cartId) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async updateCartStore(cartId, storeId) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { storeId }
    });
  }

  async findCartItem(cartId, productId) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } }
    });
  }

  async updateCartItemQuantity(itemId, quantity) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  async createCartItem(cartId, productId, quantity) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity
      }
    });
  }

  async getCartItemWithProduct(itemId) {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });
  }

  async getCartItemById(itemId) {
    return prisma.cartItem.findUnique({ where: { id: itemId } });
  }

  async deleteCartItem(itemId) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async countCartItems(cartId) {
    return prisma.cartItem.count({ where: { cartId } });
  }
}

module.exports = new CartRepository();
