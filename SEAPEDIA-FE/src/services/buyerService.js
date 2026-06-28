import api from "../lib/api";

export const buyerAPI = {
  getWallet: async () => {
    const res = await api.get('/buyer/wallet');
    return res.data;
  },
  topUpWallet: async (amount) => {
    const res = await api.post('/buyer/wallet/topup', { amount });
    return res.data;
  },
  getWalletTransactions: async () => {
    const res = await api.get('/buyer/wallet/transactions');
    return res.data;
  },
  getAddresses: async () => {
    const res = await api.get('/buyer/address');
    return res.data;
  },
  addAddress: async (data) => {
    const res = await api.post('/buyer/address', data);
    return res.data;
  },
  deleteAddress: async (id) => {
    const res = await api.delete(`/buyer/address/${id}`);
    return res.data;
  },
  setDefaultAddress: async (id) => {
    const res = await api.put(`/buyer/address/${id}/default`);
    return res.data;
  }
};
