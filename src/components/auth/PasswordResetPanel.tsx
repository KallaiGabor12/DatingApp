"use client"
import { ChangeEvent, useEffect, useState } from "react"
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Link from "next/link";
import Button from "../ui/button/Button";
import { api } from "@/lib/axios";
import { ResetRequestT, ResetResponseT } from "@/api_types/resetpass";

export default function DatingPasswordResetPanel() {
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [validMail, setValidMail] = useState(false);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    useEffect(() => {
        setValidMail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, [email])

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        setFeedback("");

        const data: ResetRequestT = { email };

        try {
            const resp = await api.post<ResetResponseT>("/auth/reset-password", data);

            if (!resp.data.code || resp.data.code !== 200) {
                setError(
                    resp.data.message ||
                    "Something went wrong. Please try again."
                );
                setIsLoading(false);
                return;
            }

            setFeedback(
                "If an account exists with this email, we’ve sent you a reset link 💌 Please check your inbox and follow the instructions."
            );
        } catch {
            setError("We couldn’t process your request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col flex-1 w-full bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-gray-900 dark:to-gray-950">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
                <div className="p-8 bg-white shadow-xl dark:bg-gray-900 rounded-2xl">

                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
                            Forgot your password? 💔
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            It happens. Enter your email and we’ll help you get back to discovering connections.
                        </p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                        <div className="space-y-6">

                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {feedback && (
                                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                                    {feedback}
                                </div>
                            )}

                            <div>
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    placeholder="you@example.com"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-3">
                                <Button
                                    className="w-full bg-pink-500 hover:bg-pink-600"
                                    size="sm"
                                    disabled={isLoading || !validMail}
                                    type="submit"
                                >
                                    {isLoading ? "Sending reset link..." : "Send Reset Link 💌"}
                                </Button>

                                <Link
                                    href="/login"
                                    className="text-sm text-center text-pink-500 hover:text-pink-600"
                                >
                                    Back to sign in ❤️
                                </Link>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 text-xs text-center text-gray-400">
                        We’ll never share your email. Promise 🤍
                    </div>
                </div>
            </div>
        </div>
    )
}