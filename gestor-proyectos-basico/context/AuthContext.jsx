"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null); // {username, role}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionRaw = localStorage.getItem("session");
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        setUser(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  const register = ({ username, password, role }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.username === username)) {
      throw new Error("Usuario ya existe");
    }
    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    // Auto-login básico
    const session = { username, role };
    localStorage.setItem("session", JSON.stringify(session));
    setUser(session);
  };

  const login = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) throw new Error("Credenciales inválidas");
    const session = { username: found.username, role: found.role };
    localStorage.setItem("session", JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem("session");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
