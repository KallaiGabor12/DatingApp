"use client"
import { ChangeEvent, useEffect, useState } from "react"
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Link from "next/link";
import Button from "../ui/button/Button";
import { api } from "@/lib/axios";
import { ResetRequestT, ResetResponseT } from "@/api_types/resetpass";

export default function PasswordResetPanel() {
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [validMail, setValidMail] = useState(false);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }

    useEffect(() => {
        setValidMail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, [email])
    const handleSubmit = async () => {
        setIsLoading(true);
        let data: ResetRequestT = {
            email: email,
        }
        await api.post<ResetResponseT>("/auth/reset-password", data).then((resp) => {
            if (!resp.data.code) {
                setError("Belső szerverhiba történt. Próbálja újra.");
                setIsLoading(false);
                return;
            }
            if (resp.data.code != 200) {
                setError(resp.data.message!);
                setIsLoading(false);
                return;
            }
            setFeedback("Amennyiben létezik a rendszerünkben a megadott email cím, elküldtünk egy üzenetet a címére. Kérjük, kövesse az abban leírt utasításokat.");
            setError("");
            return;

        }).catch(r => {
            setError("Belső szerverhiba történt. Próbálja újra.");
            setIsLoading(false);
            return;
        });
    }
    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Jelszó visszaállítása
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Adja meg az email címét!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                            <div className="space-y-6">
                                {error && (
                                    <p className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                        {error}
                                    </p>
                                )}
                                {feedback && (
                                    <p className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">{feedback}</p>
                                )}
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        name="email"
                                        placeholder="cim@valami.hu"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        disabled={isLoading || !validMail}
                                        type="submit"
                                    >
                                        {isLoading ? "Küldés..." : "Küldés"}
                                    </Button>
                                    <Link
                                        href="/login"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-center"
                                    >
                                        Vissza a bejelentkezéshez
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}