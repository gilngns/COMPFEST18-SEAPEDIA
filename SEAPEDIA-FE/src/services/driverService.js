import api from "../lib/api";

export const driverAPI = {
  getDashboard: async () => {
    const res = await api.get('/driver/dashboard');
    return res.data;
  },
  getAvailableJobs: async () => {
    const res = await api.get('/driver/jobs');
    return res.data;
  },
  getJobDetail: async (orderId) => {
    const res = await api.get(`/driver/jobs/${orderId}`);
    return res.data;
  },
  getMyDeliveries: async () => {
    const res = await api.get('/driver/deliveries');
    return res.data;
  },
  takeJob: async (orderId) => {
    const res = await api.post(`/driver/jobs/${orderId}/take`);
    return res.data;
  },
  completeJob: async (orderId) => {
    const res = await api.post(`/driver/jobs/${orderId}/complete`);
    return res.data;
  }
};
