"use client"
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useEffect, useReducer, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { api } from "@/lib/axios";
import { ResetPasswordRequest, ResetPasswordResponse } from "@/api_types/resetpass";
import Link from "next/link";

export default function PasswordResetForm({ token }: { token: string }) {
    const [newpass, setNewpass] = useState("");
    const [newpass2, setNewpass2] = useState("");

    const [error, setError] = useState<string>("");

    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const [matching, setMatching] = useState(false);
    const [length, setLength] = useState(false);
    const [hasNum, setHasNum] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expired, setExpired] = useState(false);
    const [feedback, setFeedback] = useState(false);

    useEffect(() => {
        // Validate new password
        setLength(newpass.length >= 7);
        setMatching(newpass === newpass2);
        setHasNum(/\d/.test(newpass));          // contains a number
        setLowerCase(/[a-z]/.test(newpass));    // contains lowercase
        setUpperCase(/[A-Z]/.test(newpass));    // contains uppercase
    }, [newpass, newpass2]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        let data: ResetPasswordRequest = {
            newpass: newpass,
            newpass2: newpass2,
            token: token,
        }
        await api.post<ResetPasswordResponse>("/auth/reset-password/reset", data)
            .then(async (response) => {
                setIsLoading(false);
                if (!response.data.success) {
                    switch (response.data.code) {
                        case 400: // password validation
                            setError(response.data.message as string);
                            break;
                        case 501: // missing data
                            setError("Hiányzó adatok");
                            break;
                        case 502: // token problems (expiry)
                            setError("A link érvénytelen vagy lejárt.");
                            setExpired(true);
                            break;
                        case 503: // deleted user
                            setError("Úgy tűnik, hogy a linkhez rendelt felhasználó már nem létezik.");
                            setIsLoading(true);
                            break;
                        default: // 500
                            setError("Belső szerverhiba történt. Próbálja újra.");
                            break;
                    }
                    return;
                }
                setError("");

                setFeedback(true)
            })
            .catch(reason => {
                setError("Belső szerverhiba. Próbálja újra");
                setIsLoading(false);
            });
    }
    return (
        <div className="min-h-max w-full rounded-2xl border border-gray-300 bg-white px-5 py-7 xl:px-10 xl:py-12 flex-wrap flex justify-center align-center">
            {expired && (<div className="border-gray-300 p-4 rounded-md flex flex-col justify-start items-start mb-5">
                <h3 className="text-2xl mb-2 text-red-500">Érvénytelen vagy lejárt kérés</h3>
                <Link
                    href="/login"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-center"
                >
                    Vissza a bejelentkezéshez
                </Link>
            </div>)}

            {feedback && (<div className="border-gray-300 p-4 rounded-md flex flex-col justify-start items-start mb-5">
                <h3 className="text-2xl mb-2 text-green-600">Sikeres jelszóváltoztatás</h3>
                <Link
                    href="/login"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-center"
                >
                    Vissza a bejelentkezéshez
                </Link>
            </div>)}

            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="w-70 pb-4">
                <div className="border-b-[1px] mb-3 border-gray-200 w-70">
                    <Label className="text-md mb-1 ">Új Jelszó</Label>
                    <div className="relative mb-5">
                        <Input
                            onInput={(v) => { setNewpass(v.currentTarget.value) }}
                            value={newpass} type={showPassword2 ? "text" : "password"} autoComplete="off"
                            name="newpass" required disabled={isLoading || expired || feedback}
                        ></Input>
                        <span
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword2 ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                        </span>
                    </div>

                    <Label className="text-md mb-1 ">Új Jelszó Megerősítése</Label>
                    <div className="relative mb-3">
                        <Input
                            onInput={(v) => { setNewpass2(v.currentTarget.value) }}
                            value={newpass2} type={showPassword3 ? "text" : "password"} autoComplete="off"
                            name="newpass2" required disabled={isLoading || expired || feedback}
                        ></Input>
                        <span
                            onClick={() => setShowPassword3(!showPassword3)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword3 ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                        </span>
                    </div>
                </div>
                <Link
                    href="/login"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-center"
                >
                    Vissza a bejelentkezéshez
                </Link>
                <Button className="w-70 mt-1.5" type="submit" disabled={!(length && hasNum && matching && upperCase && lowerCase && !isLoading) || expired || feedback}>Jelszó megváltoztatása</Button>
            </Form>


            {!expired && !feedback && (<div className="border-[1px] border-gray-300 p-4 rounded-md flex flex-col justify-start items-start">
                <h3 className="text-2xl mb-2">Jelszó követelmények:</h3>
                <ul className="[&>li]:list-disc my-0 [&>li]:my-1.5 pl-4">
                    <li className={`${length ? "text-green-600" : "text-red-600"}`}>Minimum 7 karakter</li>
                    <li className={`${hasNum ? "text-green-600" : "text-red-600"}`}>Minimum 1 szám</li>
                    <li className={`${lowerCase && upperCase ? "text-green-600" : "text-red-600"}`}>Minimum egy kis és egy nagy karakter</li>
                    <li className={`${matching ? "text-green-600" : "text-red-600"}`}>Egyező jelszó mezők</li>
                </ul>
            </div>)}
        </div>
    )
}