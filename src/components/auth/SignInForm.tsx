"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DatingSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClientLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const router = useRouter();

  // Sync state with password manager filled values
  useEffect(() => {
    const syncValues = () => {
      if (emailRef.current && emailRef.current.value !== email) {
        setEmail(emailRef.current.value);
      }
      if (passwordRef.current && passwordRef.current.value !== password) {
        setPassword(passwordRef.current.value);
      }
    };

    syncValues();
    const interval = setInterval(syncValues, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [email, password]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const resp = await login({ email, password });
      if (resp.success) router.push("/profile");
      setError(!resp.success ? resp.message! : "");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Oops! Something went wrong. Please try again 💔"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col flex-1 w-full bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
              Welcome back ❤️
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Log in to continue discovering meaningful connections.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  ref={emailRef}
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    ref={passwordRef}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/reset-password"
                  className="text-pink-500 hover:text-pink-600"
                >
                  Forgot your password?
                </Link>
                <Link
                  href="/register"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  New here? Sign up ✨
                </Link>
              </div>

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                size="sm"
                disabled={isClientLoading}
                type="submit"
              >
                {isClientLoading ? "Signing you in..." : "Start Matching 💕"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-xs text-center text-gray-400">
            By logging in, you agree to spread kindness and respect 💌
          </div>
        </div>
      </div>
    </div>
  );
}