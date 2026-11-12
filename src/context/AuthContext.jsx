import { createContext, useContext, useState } from "react";
import { load, save } from "../utils/format";

const AuthContext = createContext(null);

// NOTE: This is a demo login that stores users in the browser (localStorage).
// A real website needs a backend and hashed passwords.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load("eventora_user", null));

  const startSession = (u) => {
    const session = { name: u.name, email: u.email };
    setUser(session);
    save("eventora_user", session);
  };

  const signup = (name, email, password) => {
    const users = load("eventora_users", []);
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === cleanEmail)) {
      return { success: false, message: "This email is already registered" };
    }
    const newUser = { name: name.trim(), email: cleanEmail, password };
    save("eventora_users", [...users, newUser]);
    startSession(newUser);
    return { success: true };
  };

  const login = (email, password) => {
    const users = load("eventora_users", []);
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email === cleanEmail && u.password === password);
    if (!found) return { success: false, message: "Wrong email or password" };
    startSession(found);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventora_user");
  };

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
