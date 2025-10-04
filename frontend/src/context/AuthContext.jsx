import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
    withCredentials: true,
  });

  // Try to refresh session only once on mount
  useEffect(() => {
    let didTry = false;
    const checkSession = async () => {
      if (didTry) return;
      didTry = true;
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    return res.data;
  };

  // Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
  };

  // Axios interceptor → auto refresh access token only if accessToken exists
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (
        err.response?.status === 401 &&
        !err.config._retry &&
        accessToken // Only try if we have an accessToken
      ) {
        err.config._retry = true;
        try {
          const refreshRes = await api.post("/auth/refresh");
          setAccessToken(refreshRes.data.accessToken);
          err.config.headers[
            "Authorization"
          ] = `Bearer ${refreshRes.data.accessToken}`;
          return api(err.config);
        } catch {
          setUser(null);
          setAccessToken(null);
        }
      }
      return Promise.reject(err);
    }
  );

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);