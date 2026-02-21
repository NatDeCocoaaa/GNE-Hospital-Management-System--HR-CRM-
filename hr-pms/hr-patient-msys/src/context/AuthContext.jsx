// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state.  Wrap your entire app with <AuthProvider>.
// Then call useAuth() anywhere to read { user, token, loading } or trigger
// signIn / signOut.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login,
  logout,
  getStoredToken,
  getStoredUser,
  isAuthenticated,
  ROLE_ROUTES,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true); // true while we rehydrate

  // ── Rehydrate from sessionStorage on first mount ──────────────────────────
  useEffect(() => {
    if (isAuthenticated()) {
      setToken(getStoredToken());
      setUser(getStoredUser());
    }
    setLoading(false);
  }, []);

  // ── signIn wraps authService.login ───────────────────────────────────────
  const signIn = useCallback(async (credentials) => {
    const result = await login(credentials);   // throws on failure
    setToken(result.token);
    setUser(result.user);
    return result;                             // caller can read .redirectTo
  }, []);

  // signOut 
  const signOut = useCallback(() => {
    logout();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    redirectPath: user ? (ROLE_ROUTES[user.role] ?? "/dashboard") : "/login",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}