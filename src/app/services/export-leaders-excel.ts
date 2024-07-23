import { Leader } from "../types/leader";
import * as XLSX from "xlsx";

export async function exportLeadersToExcel(leaders: Leader[]) {
    try {
        const data = leaders.map(leader => ({
            Nome: leader.name,
            Email: leader.email,
            "Data de cadastro": leader.createdAt ?? "",
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leaders");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lideres.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) { 
        console.error("Error exporting leaders to Excel:", error);
    }
}
