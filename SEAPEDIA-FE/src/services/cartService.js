import api from "../lib/api";

export const cartService = {
  async getCart() {
    const res = await api.get("/cart");
    return res.data;
  },
  async addToCart(productId, quantity, replaceStore = false) {
    const res = await api.post("/cart", { productId, quantity, replaceStore });
    return res.data;
  },
  async updateItemQuantity(itemId, quantity) {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    return res.data;
  },
  async removeItem(itemId) {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data;
  },
  async clearCart() {
    const res = await api.delete("/cart");
    return res.data;
  }
};
