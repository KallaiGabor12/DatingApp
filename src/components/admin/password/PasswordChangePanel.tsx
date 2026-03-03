"use client"
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useEffect, useReducer, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { api } from "@/lib/axios";
import { ChangePassRequestT, ChangePassResponseT } from "@/api_types/changepass";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PasswordChangePanel() {
    const [oldpass, setOldpass] = useState("");
    const [newpass, setNewpass] = useState("");
    const [newpass2, setNewpass2] = useState("");

    const [error, setError] = useState<string>("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const [matching, setMatching] = useState(false);
    const [length, setLength] = useState(false);
    const [hasNum, setHasNum] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [upperCase, setUpperCase] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const {logout} = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Validate new password
        setLength(newpass.length >= 7);
        setMatching(newpass === newpass2);
        setHasNum(/\d/.test(newpass));          // contains a number
        setLowerCase(/[a-z]/.test(newpass));    // contains lowercase
        setUpperCase(/[A-Z]/.test(newpass));    // contains uppercase
    }, [oldpass, newpass, newpass2]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        let data: ChangePassRequestT = {
            oldpass: oldpass,
            newpass: newpass,
            newpass2: newpass2,
        }
        await api.post<ChangePassResponseT>("auth/changepass", data)
            .then(async (response) => {
                if (response.data.code != 200) {
                    setError(response.data.message as string)
                    setIsLoading(false);
                    return;
                }
                //success
                await logout();
                return router.push("/login");
            })
            .catch(reason => {
                setError("Belső szerverhiba. Próbálja újra");
                setIsLoading(false);
            });
    }
    return (
        <div className="min-h-max rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 
        dark:bg-white/3 xl:px-10 xl:py-12 flex align-center gap-10">
            <Form onSubmit={(e) =>{e.preventDefault(); handleSubmit()}} className="w-70 py-4">
                <div className="w-70">
                    <p className={`bg-red-300 text-red-700 border-red-500 border-2 rounded-sm py-1.5 px-2 mb-2.5 ${error != "" ? "block" : "hidden"}`}>{error}</p>
                    <Label className="text-md mb-1 ">Régi Jelszó</Label>
                    <div className="relative mb-3">
                        <Input
                            onInput={(v) => { setOldpass(v.currentTarget.value) }}
                            value={oldpass} type={showPassword ? "text" : "password"} autoComplete="off"
                            name="oldpass" required disabled={isLoading}
                        ></Input>
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

                <div className="border-t border-b mb-3 border-gray-200 pt-3 w-70">
                    <Label className="text-md mb-1 ">Új Jelszó</Label>
                    <div className="relative mb-5">
                        <Input
                            onInput={(v) => { setNewpass(v.currentTarget.value) }}
                            value={newpass} type={showPassword2 ? "text" : "password"} autoComplete="off"
                            name="newpass" required disabled={isLoading}
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
                            name="newpass2" required disabled={isLoading}
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
                <Button className="w-70" type="submit" disabled={!(length && hasNum && matching && upperCase && lowerCase && !isLoading)}>Jelszó megváltoztatása</Button>
            </Form>


            <div className="border border-gray-200 p-4 rounded-md flex flex-col justify-start items-start">
                <h3 className="text-2xl mb-2">Jelszó követelmények:</h3>
                <ul className="[&>li]:list-disc my-0 [&>li]:my-2 pl-4">
                    <li className={`${length ? "text-green-600" : "text-red-600"}`}>Minimum 7 karakter</li>
                    <li className={`${hasNum ? "text-green-600" : "text-red-600"}`}>Minimum 1 szám</li>
                    <li className={`${lowerCase && upperCase ? "text-green-600" : "text-red-600"}`}>Minimum egy kis és egy nagy karakter</li>
                    <li className={`${matching ? "text-green-600" : "text-red-600"}`}>Egyező jelszó mezők</li>
                </ul>
                <p className="h-max mt-auto">A jelszó változtatás után újra be kell jelentkezni.</p>
            </div>
        </div>
    )
}