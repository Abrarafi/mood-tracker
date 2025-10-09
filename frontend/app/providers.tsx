"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/lib/contexts/session-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <PrivyProvider
    //   appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
    //   config={{
    //     loginMethods: ["wallet"],
    //     appearance: {
    //       theme: "dark",
    //       accentColor: "#674188",
    //       showWalletLoginFirst: true,
    //     },
    //   }}
    // >
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
    // </PrivyProvider>
  );
}
