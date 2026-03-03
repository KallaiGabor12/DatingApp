import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { GalleryContext } from "./GalleryEditor"
import { ReferenceImage } from "@prisma/client";
import { api } from "@/lib/axios";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import ImageOrderManager from "./ImageOrderManager";
import heic2any from "heic2any";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_TEXT = `${(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(1)} MB`;

export default function ImagesManager() {
    const ctx = useContext(GalleryContext);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validImg, setIsValid] = useState(false);
    const [validationMsg, setValidationMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [altText, setAltText] = useState("");
    const [titleText, setTitleText] = useState("");
    const imgref = useRef<HTMLInputElement | null>(null);

    const clearSelection = (message?: string) => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setSelectedFile(null);
        setIsValid(false);
        setValidationMsg(message ?? null);
        setAltText("");
        setTitleText("");
        if (imgref.current) {
            imgref.current.value = "";
        }
    };

    const getImgs = async () => {
        try {
            const resp = await api.post<{ images: ReferenceImage[] }>("/admin/gallery/getall");
            ctx.images.set(resp.data.images);
        } catch {
            // silently ignore fetch errors in the admin view
        }
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isLoading) return;

        const file = e.target.files != null ? e.target.files[0] : null;
        if (!file) {
            clearSelection();
            return;
        }
        setSuccessMsg(null);

        // Check file extension as fallback (browsers often don't report correct MIME type for HEIC)
        const fileName = file.name.toLowerCase();
        const isHeicByExtension = fileName.endsWith(".heic") || fileName.endsWith(".heif");
        const isHeicByMime = file.type === "image/heic" || file.type === "image/heif" || file.type === "";
        
        // Validate file type (allow HEIC by extension if MIME type is missing/incorrect)
        if (!ALLOWED_MIME_TYPES.includes(file.type) && !isHeicByExtension) {
            clearSelection("Csak JPG, PNG, WEBP vagy HEIC képet tölts fel.");
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            clearSelection(`Túl nagy fájl. Maximum ${MAX_FILE_SIZE_TEXT}.`);
            return;
        }

        let fileToProcess = file;
        let previewUrl: string;

        // Convert HEIC to JPG for preview (check both MIME type and extension)
        if (isHeicByMime || isHeicByExtension) {
            try {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.92,
                });
                const convertedFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                fileToProcess = new File([convertedFile], file.name.replace(/\.heic?$/i, ".jpg"), {
                    type: "image/jpeg",
                });
                previewUrl = URL.createObjectURL(convertedFile);
            } catch (error) {
                clearSelection("A HEIC kép konvertálása nem sikerült.");
                return;
            }
        } else {
            previewUrl = URL.createObjectURL(file);
        }

        const img = new window.Image();

        img.onload = () => {
            const isLandscape = img.width > img.height;
            if (!isLandscape) {
                URL.revokeObjectURL(previewUrl);
                clearSelection("Csak fekvő (landscape) képet válassz.");
                return;
            }

            if (preview) URL.revokeObjectURL(preview);
            setPreview(previewUrl);
            setSelectedFile(fileToProcess);
            setIsValid(true);
            setValidationMsg(null);
        };

        img.onerror = () => {
            URL.revokeObjectURL(previewUrl);
            clearSelection("A képet nem sikerült beolvasni.");
        };

        img.src = previewUrl;
    };

    const handleSaveClick = async () => {
        if (isLoading) return;
        if (!selectedFile || !validImg) return;
        if (!ctx.groups.selected.get) {
            setValidationMsg("Válassz egy csoportot a mentéshez.");
            return;
        }
        if (!altText.trim()) {
            setValidationMsg("Adj meg ALT szöveget a képhez.");
            return;
        }
        if (!titleText.trim()) {
            setValidationMsg("Adj meg címet a képhez.");
            return;
        }

        // selectedFile is already converted to JPG if it was originally HEIC
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("groupId", String(ctx.groups.selected.get.id));
        formData.append("alt", altText.trim());
        formData.append("title", titleText.trim());

        try {
            setIsLoading(true);
            await api.post("/admin/gallery/create", formData);
            await getImgs();
            setSuccessMsg("Sikeres mentés.");
            clearSelection();
        } catch (error) {
            setValidationMsg("A mentés nem sikerült. Próbáld újra.");
            // silently ignore fetch/log here as well
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getImgs();
    }, []);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return <>
        <ComponentCard title="Feltöltés" className="mt-8">
            <div className="flex flex-col gap-6">
                <Form onSubmit={(e) => { e.preventDefault() }} className="flex flex-row gap-6 items-start justify-between w-full">
                    <div className="flex flex-col gap-3 max-w-md w-full">
                        <Input type="file" accept="image/*,.heic,.heif" id="finp" className="hidden" onChange={handleImageChange} ref={imgref} disabled={isLoading} />
                        <Label
                            htmlFor="finp"
                            className={`px-5 py-3 bg-main text-white w-max rounded-md uppercase font-bold cursor-pointer hover:bg-blue-400 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
                        >
                            Kép feltöltése
                        </Label>
                        <p className="text-sm text-gray-600">
                            Csak fekvő tájolású képeket fogadunk el (4:3 vagy 16:9 ajánlott).
                        </p>
                        <p className="text-sm text-gray-600">
                            Engedélyezett típusok: JPG, PNG, WEBP, HEIC. Max méret: {MAX_FILE_SIZE_TEXT}.
                        </p>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="altText" className="text-sm font-semibold text-gray-700">Helyettesítő szöveg (ha a kép nem jeleníthető meg)</Label>
                            <Input
                                id="altText"
                                type="text"
                                placeholder="Pl. Modern iroda belső tere"
                                value={altText}
                                onChange={(e) => {
                                    setAltText(e.target.value);
                                    setSuccessMsg(null);
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="titleText" className="text-sm font-semibold text-gray-700">Cím</Label>
                            <Input
                                id="titleText"
                                type="text"
                                placeholder="Pl. Referenciakép 2024/05"
                                value={titleText}
                                onChange={(e) => {
                                    setTitleText(e.target.value);
                                    setSuccessMsg(null);
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        {validationMsg && <p className="mt-2 text-sm text-red-500">{validationMsg}</p>}
                        {successMsg && <p className="mt-2 text-sm text-green-600">{successMsg}</p>}
                        <div className="mt-auto flex">
                            <Button
                                type="button"
                                onClick={handleSaveClick}
                                className="px-5 py-3 bg-main text-white w-max rounded-md uppercase font-bold cursor-pointer hover:bg-blue-400!"
                                disabled={!validImg || isLoading || !altText.trim() || !titleText.trim()}
                            >
                                {isLoading ? "Mentés folyamatban..." : "Mentés"}
                            </Button>
                        </div>
                    </div>
                    {preview && (
                        <div className={`rounded-lg overflow-hidden border border-gray-200 max-w-2xl ${isLoading ? "blur-sm" : ""}`}>
                            <Image alt="Előnézet" title={titleText} src={preview} fill className=" w-full h-auto object-cover relative!" unoptimized />
                        </div>
                    )}
                    {!preview && <div className="w-7/12 aspect-video bg-gray-300 rounded-md"></div> }
                </Form>
            </div>
        </ComponentCard>
        <ImageOrderManager />
    </>
}