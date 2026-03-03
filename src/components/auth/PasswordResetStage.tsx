"use client"
import { useState } from "react";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetStage({ isValidToken = false, server_error = "", token, isBanned = false }: { isValidToken: boolean, server_error: string | null, token: string, isBanned?: boolean }) {
    const [error, setError] = useState("");
    const [expired, setExpired] = useState(false);

    if (!isValidToken)
        return (<div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            {isBanned ? "Túl sok sikertelen kísérlet" : "Érvénytelen kérés"}
                        </h1>
                        <p className="text-sm mb-5 text-gray-500 dark:text-gray-400">
                            {server_error || (isBanned ? "Túl sok sikertelen kísérlet. Kérjük, próbálja újra később." : "A link érvénytelen vagy lejárt.")}
                        </p>
                        <Link
                            href="/login"
                            className="text-sm mt-7 text-brand-500 hover:text-brand-600 dark:text-brand-400 text-center"
                        >
                            Vissza a bejelentkezéshez
                        </Link>
                    </div>
                </div>
            </div>
        </div>)


    return (<div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
                <p className={`bg-red-300 text-red-700 border-red-500 border-2 rounded-sm py-1.5 px-2 mb-2.5 ${error != "" ? "block" : "hidden"}`}>{error}</p>
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Jelszó visszaállítása
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adja meg az új jelszót
                    </p>
                </div>
                <div>
                    <PasswordResetForm token={token} />
                </div>
            </div>
        </div>
    </div>)
}