"use client"
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/lib/axios";
import { logDateToString } from "@/lib/dateUtils";
import { Log } from "@prisma/client";
import { useEffect, useState } from "react";

export default function LogsAdminPanel(){
    const [logs, setLogs] = useState<Log[]>([]);
    const [count, setCount] = useState(400);

    const getLogs = async () => {
        setLogs(await api.post<{logs: Log[]}>("/admin/logs/get", {count: count}).then(r => r.data.logs));
    }
    useEffect(()=>{
        getLogs();
    },[])
    return <ComponentCard title="Naplófájlok">
        <table className="border-separate border-spacing-2 w-max justify-start">
        {logs.map((l,i) => <tr key={i} className={`text-[12px] font-semibold my-1 ${l.type == "LOG" ? "text-black" : (l.type == "WARN" ? "text-warning-600" : "text-error-800")}`}>
                <td>{logDateToString(l.date)}</td>
                <td>[{l.type}]</td>
                <td>{l.message}</td>
            </tr>
        )}
        </table>
    </ComponentCard>
}