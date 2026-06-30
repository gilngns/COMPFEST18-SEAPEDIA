import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    
    if (!error.response && config) {
      config._retryCount = config._retryCount || 0;
      if (config._retryCount < 5) {
        config._retryCount += 1;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(config);
      }
    }

    if (error.response && error.response.status === 401) {
      
      
      
    }
    return Promise.reject(error);
  }
);

export default api;
