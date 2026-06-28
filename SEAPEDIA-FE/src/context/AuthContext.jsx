import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getMe()
      .then((res) => {
        setUser({ ...res.data, activeRole: res.activeRole });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function setSession(userData) {
    setUser(userData);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      const path = window.location.pathname;
      if (path !== "/" && path !== "/search" && !path.startsWith("/product") && path !== "/catalog") {
        window.location.href = "/login";
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, setSession, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}