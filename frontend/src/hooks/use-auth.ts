"use client";

import { useState, useEffect, useCallback } from "react";
import { api, setToken, clearToken } from "@/lib/api";

interface User {
  id: string;
  phone: string;
  display_name: string | null;
  coin_balance: number;
  referral_code: string;
  is_admin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/users/me");
      setUser(me);
    } catch {
      clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const requestOtp = async (phone: string) => {
    await api.post("/auth/request-otp", { phone });
  };

  const verifyOtp = async (phone: string, code: string) => {
    const res = await api.post<{ access_token: string }>("/auth/verify-otp", { phone, code });
    setToken(res.access_token);
    const me = await api.get<User>("/users/me");
    setUser(me);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    clearToken();
    setUser(null);
  };

  const refreshUser = () => loadUser();

  return { user, loading, requestOtp, verifyOtp, logout, refreshUser };
}
