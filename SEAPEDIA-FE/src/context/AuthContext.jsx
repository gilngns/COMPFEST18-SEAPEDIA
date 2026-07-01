import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authService.getMe()
      .then((res) => {
        const { profile, activeRole } = res.data;
        setUser({ ...profile, activeRole });
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
      const path = location.pathname;
      if (path !== "/" && path !== "/search" && !path.startsWith("/product") && path !== "/catalog") {
        navigate("/");
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