"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DatingRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don’t match 💔");
      setIsLoading(false);
      return;
    }

    try {
      const resp = await register({
        email: formData.email,
        password: formData.password
      });

      if (resp.success) router.push("/discover");
      if (!resp.success) setError(resp.message!);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="h-screen flex flex-col flex-1 w-full bg-gradient-to-br from-rose-50 via-white to-pink-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
          
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
              Create your profile ✨
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join and start discovering meaningful connections today.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                size="sm"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating your profile..." : "Start Your Journey 💕"}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-pink-500 hover:text-pink-600"
                >
                  Sign in ❤️
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-6 text-xs text-center text-gray-400">
            By joining, you agree to treat others with kindness and respect 💌
          </div>
        </div>
      </div>
    </div>
  );
}