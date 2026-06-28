import api from "../lib/api";

export const sellerAPI = {
  upsertStore: async (data, config) => {
    const res = await api.post('/seller/store', data, config);
    return res.data;
  },
  getMyStore: async () => {
    const res = await api.get('/seller/store/me');
    return res.data;
  },
  getPublicStore: async (id) => {
    const res = await api.get(`/seller/store/${id}`);
    return res.data;
  },
  createProduct: async (data, config) => {
    const res = await api.post('/seller/products', data, config);
    return res.data;
  },
  listMyProducts: async () => {
    const res = await api.get('/seller/products');
    return res.data;
  },
  updateProduct: async (id, data, config) => {
    const res = await api.put(`/seller/products/${id}`, data, config);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/seller/products/${id}`);
    return res.data;
  },
  getWallet: async () => {
    const res = await api.get('/seller/wallet');
    return res.data;
  },
  getWalletTransactions: async () => {
    const res = await api.get('/seller/wallet/transactions');
    return res.data;
  },
  withdrawFunds: async (amount) => {
    const res = await api.post('/seller/wallet/withdraw', { amount });
    return res.data;
  }
};
