"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Redirects to /admin/login if no token is present. Returns the token
// once available (or null while checking).
export function useAdminAuth() {
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem("resonate_admin_token");
    if (!stored) {
      router.push("/admin/login");
    } else {
      setToken(stored);
    }
    setChecked(true);
  }, [router]);

  function logout() {
    window.localStorage.removeItem("resonate_admin_token");
    router.push("/admin/login");
  }

  return { token, checked, logout };
}
