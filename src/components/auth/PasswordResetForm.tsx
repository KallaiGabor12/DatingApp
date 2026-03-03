"use client"
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { api } from "@/lib/axios";
import { ResetPasswordRequest, ResetPasswordResponse } from "@/api_types/resetpass";
import Link from "next/link";

export default function PasswordResetForm({ token }: { token: string }) {

  const [newpass, setNewpass] = useState("");
  const [newpass2, setNewpass2] = useState("");
  const [error, setError] = useState<string>("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [matching, setMatching] = useState(false);
  const [length, setLength] = useState(false);
  const [hasNum, setHasNum] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [upperCase, setUpperCase] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLength(newpass.length >= 7);
    setMatching(newpass === newpass2);
    setHasNum(/\d/.test(newpass));
    setLowerCase(/[a-z]/.test(newpass));
    setUpperCase(/[A-Z]/.test(newpass));
  }, [newpass, newpass2]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    const data: ResetPasswordRequest = {
      newpass,
      newpass2,
      token,
    };

    try {
      const response = await api.post<ResetPasswordResponse>(
        "/auth/reset-password/reset",
        data
      );

      if (!response.data.success) {
        switch (response.data.code) {
          case 502:
            setError("This reset link has expired 💔");
            setExpired(true);
            break;
          default:
            setError(response.data.message || "Something went wrong.");
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("We couldn’t update your password. Please try again.");
      setIsLoading(false);
    }
  };

  if (expired) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">
          This reset link is no longer valid.
        </p>
        <Link href="/login" className="text-pink-500 hover:text-pink-600 text-sm">
          Back to sign in ❤️
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-green-600 mb-3">
          Password updated successfully ✨
        </h3>
        <Link href="/login" className="text-pink-500 hover:text-pink-600 text-sm">
          Continue to sign in ❤️
        </Link>
      </div>
    );
  }

  return (
    <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="space-y-5">

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Label>New Password</Label>
          <div className="relative">
            <Input
              value={newpass}
              onInput={(e) => setNewpass(e.currentTarget.value)}
              type={show1 ? "text" : "password"}
              disabled={isLoading}
              required
            />
            <span
              onClick={() => setShow1(!show1)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
            >
              {show1 ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
        </div>

        <div>
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              value={newpass2}
              onInput={(e) => setNewpass2(e.currentTarget.value)}
              type={show2 ? "text" : "password"}
              disabled={isLoading}
              required
            />
            <span
              onClick={() => setShow2(!show2)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
            >
              {show2 ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
        </div>

        <Button
          className="w-full bg-pink-500 hover:bg-pink-600"
          type="submit"
          disabled={!(length && hasNum && matching && upperCase && lowerCase) || isLoading}
        >
          {isLoading ? "Updating..." : "Update Password 💕"}
        </Button>

        <Link href="/login" className="block text-center text-sm text-pink-500 hover:text-pink-600">
          Back to sign in
        </Link>

        <div className="mt-6 text-sm text-gray-500">
          <p className="font-medium mb-2">Password requirements:</p>
          <ul className="space-y-1">
            <li className={length ? "text-green-600" : "text-red-500"}>
              • At least 7 characters
            </li>
            <li className={hasNum ? "text-green-600" : "text-red-500"}>
              • At least one number
            </li>
            <li className={lowerCase && upperCase ? "text-green-600" : "text-red-500"}>
              • Uppercase and lowercase letter
            </li>
            <li className={matching ? "text-green-600" : "text-red-500"}>
              • Passwords match
            </li>
          </ul>
        </div>

      </div>
    </Form>
  );
}