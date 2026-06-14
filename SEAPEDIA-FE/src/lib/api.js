import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jangan redirect jika error berasal dari cek sesi awal (/auth/me)
      // atau user sudah berada di halaman auth
      const isAuthRequest = error.config.url.includes("/auth/me");
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";
      
      if (!isAuthRequest && !isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
