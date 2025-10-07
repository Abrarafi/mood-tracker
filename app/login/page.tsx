"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// removed unused loginUser import
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { useToast } from "../components/ui/use-toast";


export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if user is already logged in
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      toast({
        title: "Logged in successfully",
        description: "Welcome back! Redirecting...",
      });
      router.push("/dashboard");
    } catch (err: any) {
      let message = "Failed to log in. Please try again.";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const router = useRouter();
  // const { checkSession } = useSession();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const response = await loginUser(email, password);

  //     // Store the token in localStorage
  //     localStorage.setItem("token", response.token);

  //     // Update session state
  //     await checkSession();

  //     // Wait for state to update before redirecting
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //     router.push("/dashboard");
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "Invalid email or password. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <Container className="flex flex-col items-center justify-center w-full">
        <Card className="w-full md:w-5/12 max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/10 bg-card/90 backdrop-blur-lg mt-12">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 tracking-tight">
              Sign In
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Welcome back! Please sign in to continue your journey.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-white text-black placeholder:text-muted-foreground"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-semibold mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-12 py-2 text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-white text-black placeholder:text-muted-foreground"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-base text-center font-medium">
                {error}
              </p>
            )}
            <Button
              className="w-full py-2 text-base rounded-xl font-bold bg-gradient-to-r from-primary to-primary/80 shadow-md hover:from-primary/80 hover:to-primary"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="my-6 border-t border-primary/10" />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?
              </span>
              <Link
                href="/signup"
                className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                href="/forgot-password"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
