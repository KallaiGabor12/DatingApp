"use client"
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/lib/axios";
import { Contact } from "@prisma/client";
import { useState } from "react";

export default function ContactsEditorPanel({ record }: { record: Contact }) {
    const [initials, setInitials] = useState(record);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(record.email);
    const [streetAddress, setStreetAddress] = useState(record.streetAddress);
    const [city, setCity] = useState(record.city);
    const [postal, setPostal] = useState(record.postal.toString());
    const [opens, setOpens] = useState(record.opens);
    const [closes, setCloses] = useState(record.closes);
    const [days, setDays] = useState(record.days);
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState("");

    const updateContact = async (type: keyof Contact) => {
        setIsLoading(true);
        setFeedback("");
        setErrorMessages(prev => ({ ...prev, [type]: "" }));

        let value: string;
        switch (type) {
            case "email":
                value = email;
                break;
            case "streetAddress":
                value = streetAddress;
                break;
            case "city":
                value = city;
                break;
            case "postal":
                value = postal;
                break;
            case "opens":
                value = opens;
                break;
            case "closes":
                value = closes;
                break;
            case "days":
                value = days;
                break;
            default:
                setIsLoading(false);
                return;
        }

        const payload = { type, value };

        try {
            const response = await api.post<{ success: boolean; message: string; value?: string }>(
                "/admin/chcontact",
                payload
            );

            if (!response.data.success) {
                setErrorMessages(prev => ({ ...prev, [type]: response.data.message }));
                setIsLoading(false);
                return;
            }

            setInitials(prev => ({
                ...prev,
                [type]: type === "postal" ? parseInt(response.data.value!) : response.data.value!,
            }));

            switch (type) {
                case "email":
                    setEmail(response.data.value!);
                    break;
                case "streetAddress":
                    setStreetAddress(response.data.value!);
                    break;
                case "city":
                    setCity(response.data.value!);
                    break;
                case "postal":
                    setPostal(response.data.value!);
                    break;
                case "opens":
                    setOpens(response.data.value!);
                    break;
                case "closes":
                    setCloses(response.data.value!);
                    break;
                case "days":
                    setDays(response.data.value!);
                    break;
            }

            setFeedback("Sikeres mentés");
        } catch (error) {
            const errorMessage =
                (error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Hiba történt a mentés során";
            setErrorMessages(prev => ({ ...prev, [type]: errorMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    const daysOfWeek = [
        { en: "Monday", hu: "Hétfő" },
        { en: "Tuesday", hu: "Kedd" },
        { en: "Wednesday", hu: "Szerda" },
        { en: "Thursday", hu: "Csütörtök" },
        { en: "Friday", hu: "Péntek" },
        { en: "Saturday", hu: "Szombat" },
        { en: "Sunday", hu: "Vasárnap" }
    ];

    const parseDays = (daysString: string): string[] => {
        return daysString.split(";").filter(d => d.trim().length > 0);
    };

    const formatDays = (selectedDays: string[]): string => {
        return selectedDays.join(";");
    };

    const renderField = (
        label: string,
        type: keyof Contact,
        value: string,
        setValue: (v: string) => void,
        inputType: string = "text"
    ) => {
        const error = errorMessages[type] || "";
        const hasChanged = value !== (initials[type]?.toString() || "");
        const isEmpty = value.trim().length === 0;

        return (
            <div className="w-max">
                {error && (
                    <p className="bg-red-300 text-red-700 border-red-500 border-2 rounded-sm py-1.5 px-2 mb-2.5">
                        {error}
                    </p>
                )}
                <Label className="text-md mb-1">{label}</Label>
                <div className="relative mb-3 flex gap-1 items-center">
                    <Input
                        onInput={v => setValue(v.currentTarget.value)}
                        value={value}
                        type={inputType}
                        autoComplete="off"
                        disabled={isLoading}
                        {...(type === "streetAddress" && { className: "w-[500px]!" })}
                    />
                    <Button
                        size="sm"
                        disabled={isLoading || !hasChanged || isEmpty}
                        onClick={() => updateContact(type)}
                    >
                        Mentés
                    </Button>
                    <Button
                        size="sm"
                        disabled={!hasChanged}
                        onClick={() => setValue(initials[type]?.toString() || "")}
                        variant="outline"
                    >
                        Visszaállítás
                    </Button>
                </div>
            </div>
        );
    };

    const renderDaysField = () => {
        const error = errorMessages["days"] || "";
        const selectedDays = parseDays(days);
        const initialDays = parseDays(initials.days);
        const hasChanged = selectedDays.sort().join(";") !== initialDays.sort().join(";");

        const handleDayToggle = (day: string) => {
            const updated = selectedDays.includes(day)
                ? selectedDays.filter(d => d !== day)
                : [...selectedDays, day];
            setDays(formatDays(updated));
        };

        return (
            <div className="w-max">
                {error && (
                    <p className="bg-red-300 text-red-700 border-red-500 border-2 rounded-sm py-1.5 px-2 mb-2.5">
                        {error}
                    </p>
                )}
                <Label className="text-md mb-3">Nyitvatartási napok</Label>
                <div className="mb-3">
                    <div className="flex flex-wrap gap-4 mb-3 [&_label]:border-b [&_label]:border-main">
                        {daysOfWeek.map(day => (
                            <label key={day.en} className="flex items-center gap-2 cursor-pointer pb-3 has-checked:border-b-2 has-checked:pb-[11px]">
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day.en)}
                                    onChange={() => handleDayToggle(day.en)}
                                    disabled={isLoading}
                                    className="w-4 h-4 appearance-none bg-white checked:bg-main cursor-pointer rounded-sm ring-offset-2 ring-main ring-2"
                                />
                                <span className="text-sm">{day.hu}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-1 mt-3">
                        <Button
                            size="sm"
                            disabled={isLoading || !hasChanged || selectedDays.length === 0}
                            onClick={() => updateContact("days")}
                        >
                            Mentés
                        </Button>
                        <Button
                            size="sm"
                            disabled={!hasChanged}
                            onClick={() => setDays(formatDays(initialDays))}
                            variant="outline"
                        >
                            Visszaállítás
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ComponentCard title="Kapcsolat szerkesztő">
            <p className="empty:hidden bg-green-500/20 border-2 border-green-500 rounded-sm w-max py-1 px-2 text-green-800 my-2">
                {feedback}
            </p>

            {renderField("E-Mail", "email", email, setEmail)}
            {renderField("Utca cím", "streetAddress", streetAddress, setStreetAddress, "text")}
            {renderField("Város", "city", city, setCity, "text")}
            {renderField("Irányítószám", "postal", postal, setPostal, "number")}
            {renderField("Nyitás", "opens", opens, setOpens, "time")}
            {renderField("Zárás", "closes", closes, setCloses, "time")}
            {renderDaysField()}
        </ComponentCard>
    );
}