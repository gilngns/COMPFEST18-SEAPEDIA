import api from "../lib/api";

export const catalogService = {
  async getProducts(params = {}) {
    const res = await api.get('/catalog', { params });
    return res.data;
  },

  async getProductById(id) {
    const res = await api.get(`/catalog/${id}`);
    return res.data.data;
  }
};