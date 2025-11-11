"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
  try {
    console.log("SessionContext: Checking session...");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include", // send cookies
    });

    console.log("SessionContext: Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("SessionContext: User data received:", data);
      const { password, ...safeUserData } = data.user;
      setUser(safeUserData);
    } else {
      console.log("SessionContext: Session invalid");
      setUser(null);
    }
  } catch (error) {
    console.error("SessionContext: Error checking session:", error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setUser(null);
    router.push("/");
  }
};


  useEffect(() => {
    console.log("SessionContext: Initial check");
    checkSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        // isAuthenticated: true, // --- IGNORE ---
        logout,
        checkSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}