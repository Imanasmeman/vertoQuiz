import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";
import { LogOut } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role, name }
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: load token from localStorage or try refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      // Note: optionally fetch user here if needed
      setLoading(false);
    } else {
      const checkSession = async () => {
        try {
          const res = await API.post("/auth/refresh");
          const { accessToken: newAccessToken, user: refreshedUser } = res.data;
          if (newAccessToken && refreshedUser) {
            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);
            setUser(refreshedUser);
          } else {
            setUser(null);
            localStorage.removeItem("accessToken");
            setAccessToken(null);
          }
        } catch {
          setUser(null);
          localStorage.removeItem("accessToken");
        } finally {
          setLoading(false);
        }
      };
      checkSession();
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const loggedInUser = res.data.user; // Please ensure your login API returns user object as well
    setAccessToken(token);
    setUser(loggedInUser);
    localStorage.setItem("accessToken", token);
    return res.data;
  };

  // Logout function
  const logout = async () => {
    await API.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  // Axios interceptor for token refresh
  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          accessToken
        ) {
          originalRequest._retry = true;
          try {
            const refreshRes = await API.post("/auth/refresh");
            const { accessToken: newAccessToken, user: refreshedUser } = refreshRes.data;
            setAccessToken(newAccessToken);
            setUser(refreshedUser);
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return API(originalRequest);
          } catch (err) {
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem("accessToken");
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
