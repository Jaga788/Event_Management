import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
const TOKEN_KEY = "eventora_access_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    api.me(token)
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((requestError) => {
        if (active) {
          if (requestError.status === 401 || requestError.status === 403) {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          } else {
            setError(requestError.message);
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  const login = async (email, password) => {
    const result = await api.login(email.trim().toLowerCase(), password);
    setError("");
    localStorage.setItem(TOKEN_KEY, result.access_token);
    setToken(result.access_token);
    const currentUser = await api.me(result.access_token);
    setUser(currentUser);
    setLoading(false);
    return currentUser;
  };

  const signup = async (name, email, password) => {
    await api.signup({
      full_name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError("");
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
