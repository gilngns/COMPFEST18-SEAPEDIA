import api from "../lib/api";

export const ordersAPI = {
  previewCheckout: async (discountCode = "") => {
    const res = await api.get(`/orders/preview?discountCode=${discountCode}`);
    return res.data;
  },
  checkout: async (data) => {
    const res = await api.post('/orders/checkout', data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/me');
    return res.data;
  },
  getStoreOrders: async () => {
    const res = await api.get('/orders/store');
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await api.put(`/orders/store/${id}/status`, { status });
    return res.data;
  },
  submitReviews: async (orderId, reviews) => {
    const res = await api.post(`/buyer/orders/${orderId}/reviews`, { reviews });
    return res.data;
  }
};
