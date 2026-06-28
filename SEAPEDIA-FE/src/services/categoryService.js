import api from "../lib/api";

export const categoryAPI = {
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  }
};
