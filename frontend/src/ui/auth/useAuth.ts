"use client";

import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

// Context から値を取り出すための専用フック
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return {
    user: ctx.user,
    isAuthenticated: ctx.isAuthenticated,
    isLoading: ctx.isLoading,
    register: ctx.register,
    login: ctx.login,
    logout: ctx.logout,
    reloadUser: ctx.reloadUser,
    apiClient: ctx.apiClient,
  };
}
