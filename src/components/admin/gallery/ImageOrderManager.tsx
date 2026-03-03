import { useContext, useEffect, useMemo, useState } from "react";
import { GalleryContext } from "./GalleryEditor";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import { ReferenceImage } from "@prisma/client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { api } from "@/lib/axios";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

type StatusMessage = { text: string; type: "success" | "error" };

const arraysEqual = (a: number[], b: number[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

type FullReferenceImage = ReferenceImage & { alt: string; title: string; order: number };

export default function ImageOrderManager() {
    const ctx = useContext(GalleryContext);
    const emptyDragImage = useMemo(() => {
        if (typeof window === "undefined") return null;
        const img = document.createElement("img");
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        return img;
    }, []);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const [dragPreview, setDragPreview] = useState<FullReferenceImage | null>(null);
    const [pendingOrderIds, setPendingOrderIds] = useState<Record<number, number[]>>({});
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [status, setStatus] = useState<StatusMessage | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<FullReferenceImage | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editTarget, setEditTarget] = useState<FullReferenceImage | null>(null);
    const [editAlt, setEditAlt] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const currentGroupId = ctx.groups.selected.get?.id ?? null;

    const baseImagesForGroup = useMemo(() => {
        if (!currentGroupId) return [] as FullReferenceImage[];
        const images = ctx.images.get as FullReferenceImage[];
        return images
            .filter((img) => img.groupID === currentGroupId)
            .sort((a, b) => a.order - b.order || a.timestamp - b.timestamp || a.id - b.id);
    }, [ctx.images.get, currentGroupId]);

    const orderedImages = useMemo(() => {
        if (!currentGroupId) return [] as FullReferenceImage[];
        const customOrder = pendingOrderIds[currentGroupId];
        if (!customOrder || customOrder.length === 0) return baseImagesForGroup;

        const baseMap = new Map(baseImagesForGroup.map((img) => [img.id, img]));
        const mapped = customOrder
            .map((id) => baseMap.get(id))
            .filter((img): img is FullReferenceImage => Boolean(img));
        const remaining = baseImagesForGroup.filter((img) => !customOrder.includes(img.id));
        return [...mapped, ...remaining];
    }, [baseImagesForGroup, currentGroupId, pendingOrderIds]);

    const hasChanges = useMemo(() => {
        if (!currentGroupId) return false;
        const customOrder = pendingOrderIds[currentGroupId];
        if (!customOrder) return false;
        return !arraysEqual(
            baseImagesForGroup.map((img) => img.id),
            customOrder
        );
    }, [baseImagesForGroup, currentGroupId, pendingOrderIds]);

    useEffect(() => {
        setDraggingId(null);
        setDragPosition(null);
        setDropIndex(null);
        setDragPreview(null);
        setStatus(null);
    }, [currentGroupId]);

    useEffect(() => {
        if (!isMouseDown || draggingId === null) return;

        const handleMouseMove = (e: MouseEvent) => {
            setDragPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
            setDraggingId(null);
            setDropIndex(null);
            setDragPosition(null);
            setDragPreview(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMouseDown, draggingId]);

    const refreshImages = async () => {
        try {
            setIsRefreshing(true);
            const resp = await api.post<{ images: FullReferenceImage[] }>("/admin/gallery/getall");
            ctx.images.set(resp.data.images);
        } catch {
            // silently ignore fetch errors in the admin view
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDropApply = (targetIndex: number | null) => {
        if (!currentGroupId || draggingId == null) return;
        const list = orderedImages;
        const fromIndex = list.findIndex((img) => img.id === draggingId);
        if (fromIndex === -1) return;

        const safeTarget = targetIndex == null ? fromIndex : Math.max(0, Math.min(targetIndex, list.length));
        const next = [...list];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(safeTarget, 0, moved);
        const nextIds = next.map((img) => img.id);
        setPendingOrderIds((prev) => ({ ...prev, [currentGroupId]: nextIds }));
    };

    const handleSaveOrder = async () => {
        if (!currentGroupId) return;
        const orderIds =
            pendingOrderIds[currentGroupId] && pendingOrderIds[currentGroupId]?.length > 0
                ? pendingOrderIds[currentGroupId]
                : baseImagesForGroup.map((img) => img.id);

        setIsSaving(true);
        setStatus(null);
        try {
            const resp = await api.post("/admin/gallery/reorder", {
                groupId: currentGroupId,
                orderedIds: orderIds,
            });

            if (resp.data?.success) {
                await refreshImages();
                setPendingOrderIds((prev) => {
                    const next = { ...prev };
                    delete next[currentGroupId];
                    return next;
                });
                setStatus({ text: "Sorrend mentve.", type: "success" });
            } else {
                setStatus({ text: resp.data?.error ?? "A sorrendet nem sikerült menteni.", type: "error" });
            }
        } catch {
            setStatus({ text: "A sorrendet nem sikerült menteni.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteModal = (image: FullReferenceImage) => {
        setDeleteTarget(image);
        setDeleteSuccess(false);
        setStatus(null);
    };

    const openEditModal = (image: FullReferenceImage) => {
        setEditTarget(image);
        setEditAlt(image.alt);
        setEditTitle(image.title);
        setStatus(null);
    };

    const closeEditModal = () => {
        setEditTarget(null);
        setEditAlt("");
        setEditTitle("");
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!editTarget) return;
        const trimmedAlt = editAlt.trim();
        const trimmedTitle = editTitle.trim();
        if (!trimmedAlt || !trimmedTitle) {
            setStatus({ text: "Az ALT és a cím mező nem lehet üres.", type: "error" });
            return;
        }
        setIsEditing(true);
        setStatus(null);
        try {
            const resp = await api.post("/admin/gallery/update", {
                id: editTarget.id,
                alt: trimmedAlt,
                title: trimmedTitle,
            });
            if (resp.data?.success) {
                await refreshImages();
                setStatus({ text: "Kép adatai frissítve.", type: "success" });
                closeEditModal();
            } else {
                setStatus({ text: resp.data?.error ?? "A frissítés nem sikerült.", type: "error" });
            }
        } catch {
            setStatus({ text: "A frissítés nem sikerült.", type: "error" });
        } finally {
            setIsEditing(false);
        }
    };

    const closeDeleteModal = () => {
        setDeleteTarget(null);
        setDeleteSuccess(false);
        setIsDeleting(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        setStatus(null);
        try {
            const resp = await api.post("/admin/gallery/delete", { id: deleteTarget.id });
            if (resp.data?.success) {
                await refreshImages();
                setPendingOrderIds((prev) => {
                    const next = { ...prev };
                    if (resp.data?.groupID) delete next[resp.data.groupID];
                    return next;
                });
                setDeleteSuccess(true);
            } else {
                setStatus({ text: resp.data?.error ?? "A törlés nem sikerült.", type: "error" });
            }
        } catch {
            setStatus({ text: "A törlés nem sikerült.", type: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const showOrderEmptyState = currentGroupId && orderedImages.length === 0;

    const handleResetOrder = () => {
        if (!currentGroupId) return;
        setPendingOrderIds((prev) => {
            const next = { ...prev };
            delete next[currentGroupId];
            return next;
        });
        setStatus(null);
        setDraggingId(null);
        setDropIndex(null);
    };

    return (
        <ComponentCard title="Képek" className={`mt-2 ${isMouseDown && draggingId !== null ? 'user-select-none' : ''}`}>
            {!currentGroupId && <p className="text-default">Válassz egy csoportot a képek rendezéséhez.</p>}

            {currentGroupId && (
                <>
                    {status && (
                        <p
                            className={`mb-3 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}
                        >
                            {status.text}
                        </p>
                    )}
                    <div
                        className={`overflow-x-auto pb-3 ${isMouseDown && draggingId !== null ? 'user-select-none' : ''}`}
                        style={isMouseDown && draggingId !== null ? { WebkitUserSelect: 'none', MozUserSelect: 'none' } : {}}
                        onMouseMove={(e) => {
                            if (isMouseDown && draggingId !== null) {
                                setDragPosition({ x: e.clientX, y: e.clientY });
                                // Check drop zones
                                const cards = document.querySelectorAll('[data-image-id]');
                                cards.forEach((card) => {
                                    const rect = card.getBoundingClientRect();
                                    if (e.clientX >= rect.left && e.clientX <= rect.right &&
                                        e.clientY >= rect.top && e.clientY <= rect.bottom) {
                                        const cardIdx = parseInt(card.getAttribute('data-index') || '0');
                                        const isBefore = e.clientX < rect.left + rect.width / 2;
                                        setDropIndex(isBefore ? cardIdx : cardIdx + 1);
                                    }
                                });
                            }
                        }}
                        onMouseUp={(e) => {
                            if (isMouseDown && draggingId !== null) {
                                handleDropApply(dropIndex);
                                setIsMouseDown(false);
                                setDraggingId(null);
                                setDropIndex(null);
                                setDragPosition(null);
                                setDragPreview(null);
                            }
                        }}
                    >
                        <div className="flex gap-4 min-w-max pr-4">
                            {orderedImages.map((img, idx) => (
                                <div key={img.id} className="flex items-center">
                                    {draggingId !== null && dropIndex === idx && (
                                        <div className="w-48 h-32 rounded-lg border-2 border-dashed border-main/60 bg-main/5 mr-3 shrink-0" />
                                    )}
                                    <div
                                        className={`relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 cursor-grab active:cursor-grabbing transition-all duration-150 ease-out user-select-none ${draggingId === img.id ? "ring-2 ring-main scale-[1.02] opacity-60" : "hover:scale-[1.02] hover:shadow-md"}`}
                                        data-image-id={img.id}
                                        data-index={idx}
                                        onMouseDown={(e) => {
                                            if (e.button !== 0) return; // Only left mouse button
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setIsMouseDown(true);
                                            setDraggingId(img.id);
                                            setDragPreview(img);
                                            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                                            setDragPosition({ x: e.clientX, y: e.clientY });
                                            setDropIndex(idx);
                                        }}
                                        onMouseMove={(e) => {
                                            if (!isMouseDown || draggingId !== img.id) return;
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const isBefore = e.clientX < rect.left + rect.width / 2;
                                            setDropIndex(isBefore ? idx : idx + 1);
                                        }}
                                        title={img.title}
                                    >
                                        <Image
                                            src={`/api/uploads/references/${img.filename}`}
                                            alt={img.alt || img.title || "Kép"}
                                            fill
                                            sizes="192px"
                                            className={`object-cover pointer-events-none ${isMouseDown && draggingId !== null ? 'pointer-events-none' : ''}`}
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-xs px-2 py-1 truncate">
                                            {img.title}
                                        </div>
                                        <div className="absolute top-2 right-2 flex w-11/12 flex-row-reverse items-end justify-between pointer-events-none">
                                            <button
                                                type="button"
                                                draggable={false}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteModal(img);
                                                }}
                                                className="bg-white/90 text-red-600 rounded-full p-1 shadow hover:bg-white pointer-events-auto"
                                                aria-label="Kép törlése"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                draggable={false}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(img);
                                                }}
                                                className="bg-white/90 text-blue-600 rounded-full p-1 shadow hover:bg-white pointer-events-auto"
                                                aria-label="Kép szerkesztése"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M5 6a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-5a1 1 0 112 0v5a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a1 1 0 110 2H5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {draggingId !== null && dropIndex === orderedImages.length && (
                                <div className="w-48 h-32 rounded-lg border-2 border-dashed border-main/60 bg-main/5 shrink-0" />
                            )}
                        </div>
                    </div>

                    {showOrderEmptyState && (
                        <p className="text-default mt-2">Ehhez a csoporthoz még nincs kép.</p>
                    )}

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={handleResetOrder}
                            disabled={!hasChanges || isSaving || orderedImages.length === 0}
                            className="px-5 py-2"
                        >
                            Sorrend visszaállítása
                        </Button>
                        <Button
                            onClick={handleSaveOrder}
                            disabled={!hasChanges || isSaving || orderedImages.length === 0 || isRefreshing}
                            className="px-5 py-2 bg-main text-white hover:bg-blue-400! disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Mentés..." : "Sorrend mentése"}
                        </Button>
                        {isRefreshing && <span className="text-xs text-gray-500">Frissítés...</span>}
                    </div>
                </>
            )}

            {draggingId !== null && dragPreview && dragPosition && (
                <div
                    className="fixed z-9999 pointer-events-none w-48 h-32 rounded-lg overflow-hidden shadow-lg ring-2 ring-main/70 bg-white/90"
                    style={{
                        top: dragPosition.y - dragOffset.y,
                        left: dragPosition.x - dragOffset.x,
                    }}
                >
                    <Image
                        src={`/api/uploads/references/${dragPreview.filename}`}
                        alt={dragPreview.alt || dragPreview.title || "Kép"}
                        fill
                        sizes="192px"
                        className="object-cover"
                    />
                </div>
            )}

            <Modal
                isOpen={Boolean(deleteTarget)}
                onClose={deleteSuccess ? closeDeleteModal : closeDeleteModal}
                className="max-w-[500px] m-4"
            >
                <div className="p-6">
                    {!deleteSuccess ? (
                        <>
                            <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                                Törlés megerősítése
                            </h4>
                            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-6">
                                Biztosan törölni szeretnéd ezt a képet? A művelet nem visszavonható.
                            </p>
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <Button size="sm" variant="outline" onClick={closeDeleteModal} disabled={isDeleting}>
                                    Mégse
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500! text-white! hover:bg-red-600! disabled:bg-red-300! shadow-theme-xs!"
                                >
                                    {isDeleting ? "Törlés..." : "Törlés"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                                Sikeres törlés
                            </h4>
                            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-6">
                                A kép sikeresen törölve lett.
                            </p>
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <Button size="sm" variant="outline" onClick={closeDeleteModal}>
                                    Bezárás
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            <Modal
                isOpen={Boolean(editTarget)}
                onClose={closeEditModal}
                className="max-w-[640px] m-4"
            >
                <div className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-800 text-title-sm dark:text-white/90">Kép szerkesztése</h4>
                    {editTarget && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                                src={`/api/uploads/references/${editTarget.filename}`}
                                alt={editTarget.alt || editTarget.title || "Kép"}
                                fill
                                sizes="100vw"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="editAlt" className="text-sm font-semibold text-gray-700">ALT</Label>
                            <Input
                                id="editAlt"
                                value={editAlt}
                                onChange={(e) => setEditAlt(e.target.value)}
                                disabled={isEditing}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="editTitle" className="text-sm font-semibold text-gray-700">Cím</Label>
                            <Input
                                id="editTitle"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                disabled={isEditing}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={closeEditModal} disabled={isEditing}>
                            Mégse
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit} disabled={isEditing || !editAlt.trim() || !editTitle.trim()}>
                            {isEditing ? "Mentés..." : "Mentés"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </ComponentCard>
    );
}