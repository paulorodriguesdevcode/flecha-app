import { GoalType } from "../types/goal"; 
import * as XLSX from "xlsx";

export async function exportTypesToExcel(types: GoalType[]) {
    try {
        const data = types.map(type => ({
            Nome: type.name,
            Descrição: type.description
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Types");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tipos.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting types to Excel:", error);
    }
}
