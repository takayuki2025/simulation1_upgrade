"use client";

import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import type { AuthContextType } from "./AuthContextType";

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

  // return {
  //   user: ctx.user,
  //   isAuthenticated: ctx.isAuthenticated,
  //   isLoading: ctx.isLoading,
  //   register: ctx.register,
  //   login: ctx.login,
  //   logout: ctx.logout,
  //   reloadUser: ctx.reloadUser,
  //   apiClient: ctx.apiClient,
  // };

