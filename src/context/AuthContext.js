import React, { createContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      signIn: (email, senha) => signInWithEmailAndPassword(auth, email, senha),
      signUp: (email, senha) => createUserWithEmailAndPassword(auth, email, senha),
      logout: () => signOut(auth),
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}