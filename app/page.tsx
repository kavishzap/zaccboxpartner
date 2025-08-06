"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Loader2,
  Building2,
} from "lucide-react";
import ZaccboxLogo from "../app/assets/l.png";
import Image from "next/image";
import { authenticate } from "@/lib/authService";

export default function LoginPage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tenant = company.trim();
      if (!tenant) throw new Error("Company short name is required");

      const { data, succeeded, message } = await authenticate(tenant, {
        email,
        password,
        registrationSource: "web",
      });

      if (!succeeded || !data?.token)
        throw new Error(message || "Authentication failed");

      // Persist session (adjust to your needs / use cookies if SSR-protected pages later)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("companyShortName", tenant);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "refreshTokenExpiryTime",
        data.refreshTokenExpiryTime
      );
      if (data.name) localStorage.setItem("userName", data.name);
      if (data.currency) localStorage.setItem("currency", data.currency);
      if (data.tenantLogo) localStorage.setItem("tenantLogo", data.tenantLogo);

      // Optional: route by 2FA
      if (data.isTwoFA) {
        // pass context via query or storage
        localStorage.setItem("pending2FA", "true");
        return router.push("/verify-otp");
      }

      router.push("/partner-dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
const backgroundStyle = {
    backgroundImage: 'radial-gradient(circle,#454545, transparent 1px)',
    backgroundSize: '10px 10px',
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden text-gray-100" style={backgroundStyle}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl bg-gradient-to-tr from-indigo-600/20 to-pink-600/20" />
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-gray-900 border border-gray-800 shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            Welcome to
            <Image
              src={ZaccboxLogo}
              alt="Zaccbox Logo"
              width={128} // Increased size
              height={128}
              className="object-contain"
              priority
              style={{ filter: "invert(0)" }}
            />
          </CardTitle>

          <CardDescription className="text-gray-300">
            Please sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="flex items-center gap-2 text-sm font-medium text-gray-200"
              >
                <Building2 className="h-4 w-4 text-blue-400" />
                Company
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Company short name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-12 pl-4 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-200"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-4 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-gray-200"
              >
                <Lock className="h-4 w-4 text-blue-400" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-4 pr-12 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
