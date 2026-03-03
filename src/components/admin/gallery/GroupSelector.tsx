import { useContext } from "react"
import { GalleryContext } from "./GalleryEditor"
import ComponentCard from "@/components/common/ComponentCard";
import clsx from "clsx";

export default function GroupSelector(){
    const ctx = useContext(GalleryContext);

    return <ComponentCard title="Kategória választó">
        <div className="w-full flex items-start justify-center">
        {ctx.groups.get.map((g,i) => 
            <p key={i} className={clsx(
                "text-black font-normal cursor-pointer mx-3 text-[16px]",
                ctx.groups.selected.get?.id == g.id ? "text-main font-bold!" : ""
            )} onClick={() => {ctx.groups.selected.set(g)}}>{g.name}</p>
        )}
        </div>
    </ComponentCard>
}