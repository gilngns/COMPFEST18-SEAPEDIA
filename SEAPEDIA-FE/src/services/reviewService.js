import api from "../lib/api";

export const reviewAPI = {
  getReviews: async () => {
    const res = await api.get('/reviews');
    return res.data;
  },
  createReview: async (data) => {
    const res = await api.post('/reviews', data);
    return res.data;
  }
};
