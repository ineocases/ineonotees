import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebase/config";

const AuthContext = createContext<User | null | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => onAuthStateChanged(auth, u => {
    setUser(u); setReady(true);
  }), []);

  if (!ready) return <div className="splash">Cargando…</div>;
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const user = useContext(AuthContext);
  if (user === undefined) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return user;
}