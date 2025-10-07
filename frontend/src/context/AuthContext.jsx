// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role, name }
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: refresh session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await API.post("/auth/refresh", {}, { withCredentials: true });
        const { accessToken: newAccessToken, user: refreshedUser } = res.data;
        if (newAccessToken && refreshedUser) {
          setAccessToken(newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          setUser(refreshedUser);
        } else {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("accessToken");
        }
      } catch (err) {
        console.log("Refresh failed on mount:", err.message);
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const loggedInUser = res.data.user;
    setAccessToken(token);
    setUser(loggedInUser);
    localStorage.setItem("accessToken", token);
    return res.data;
  };

  // Logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err.message);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
    }
  };

  // Axios interceptor to handle expired access tokens
  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const refreshRes = await API.post("/auth/refresh", {}, { withCredentials: true });
            const { accessToken: newAccessToken, user: refreshedUser } = refreshRes.data;

            setAccessToken(newAccessToken);
            setUser(refreshedUser);
            localStorage.setItem("accessToken", newAccessToken);

            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return API(originalRequest);
          } catch (err) {
            console.log("Refresh failed in interceptor:", err.message);
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem("accessToken");
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
