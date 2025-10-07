"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import type { User } from "@/types/user";
import {
  getCurrentUser,
  login,
  logout,
  register,
  type LoginData,
  type RegisterData,
  refreshToken,
} from "@/lib/auth";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  showLoginModal: boolean;
  showUserForm: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  // updateUser: (data: Partial<AuthState["user"]>) => Promise<void>;
  setShowLoginModal: (show: boolean) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);

  const [state, setState] = useState<AuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    showLoginModal: false,
    showUserForm: false,
  });

  const refreshUser = useCallback(async () => {
    if (isLoading) return;
    try {
      const { user } = await getCurrentUser();
      setUser(user);
    } catch (err: any) {
      setUser(null);
    }
  }, [isLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      if (isInitialized) return;

      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (err: any) {
        if (
          (err.response?.status === 401 || err.response?.status === 403) &&
          !hasAttemptedRefresh
        ) {
          setHasAttemptedRefresh(true);
          try {
            await refreshToken();
            const { user } = await getCurrentUser();
            setUser(user);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized, hasAttemptedRefresh]);

  // Update the authentication effect
  // useEffect(() => {
  //   let isSubscribed = true; // Add cleanup flag

  //   const handleAuthChange = async () => {
  //     // Skip if already loading or no change in auth state
  //     if (!isSubscribed || !privyUser?.wallet?.address) return;

  //     const walletAddress = privyUser.wallet.address;

  //     // Only proceed if authenticated and wallet address changed
  //     if (authenticated && walletAddress !== state.user?.walletAddress) {
  //       setState((s) => ({ ...s, isLoading: true }));
  //       try {
  //         const response = await fetch(`/api/users?walletId=${walletAddress}`);

  //         if (!isSubscribed) return; // Check if still subscribed before updating state

  //         if (response.ok) {
  //           const { user } = await response.json();
  //           setState((s) => ({
  //             ...s,
  //             isAuthenticated: true,
  //             user: {
  //               ...user,
  //               walletAddress,
  //             },
  //             showUserForm: false,
  //             showLoginModal: false,
  //             isLoading: false,
  //           }));
  //         } else if (response.status === 404) {
  //           setState((s) => ({
  //             ...s,
  //             isAuthenticated: false,
  //             user: { walletAddress },
  //             showUserForm: true,
  //             showLoginModal: true,
  //             isLoading: false,
  //           }));
  //         }
  //       } catch (error) {
  //         if (!isSubscribed) return;
  //         console.error("Error checking user:", error);
  //         setState((s) => ({ ...s, isLoading: false }));
  //       }
  //     } else if (!authenticated) {
  //       setState((s) => ({
  //         ...s,
  //         isAuthenticated: false,
  //         user: null,
  //         isLoading: false,
  //       }));
  //     }
  //   };

  //   handleAuthChange();

  //   // Cleanup function
  //   return () => {
  //     isSubscribed = false;
  //   };
  // }, [authenticated, privyUser?.wallet?.address]); // Only depend on these values

  const handleLogin = async (data: LoginData) => {
    setError(null);
    setHasAttemptedRefresh(false);
    try {
      const response = await login(data);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setHasAttemptedRefresh(false);
      setError(null);
      // Redirect to home page after successful logout
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err: any) {
      // Even if logout fails on server, clear local state
      setUser(null);
      setHasAttemptedRefresh(false);
      setError(err?.response?.data?.message || "Logout failed");
      // Still redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  // const updateUser = async (userData: Partial<AuthState["user"]>) => {
  //   if (!state.user?.walletAddress) return;

  //   setState((s) => ({ ...s, isLoading: true }));
  //   try {
  //     const response = await fetch("/api/users", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...userData,
  //         walletId: state.user.walletAddress,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update user");

  //     const { user } = await response.json();
  //     setState((s) => ({
  //       ...s,
  //       isAuthenticated: true,
  //       user: {
  //         ...user,
  //         walletAddress: state.user?.walletAddress,
  //       },
  //       showUserForm: false,
  //       showLoginModal: false,
  //     }));
  //   } catch (error) {
  //     console.error("Update user error:", error);
  //   } finally {
  //     setState((s) => ({ ...s, isLoading: false }));
  //   }
  // };
  const handleRegister = async (data: RegisterData) => {
    setError(null);
    setHasAttemptedRefresh(false);
    try {
      const response = await register(data);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        error,
        // refreshUser,
        setShowLoginModal: (show) =>
          setState((s) => ({ ...s, showLoginModal: show })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
