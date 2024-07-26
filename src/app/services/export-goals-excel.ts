import { Goal } from "../types/goal";
import * as XLSX from "xlsx";

export async function exportGoalsToExcel(goals: Goal[]) {
    try {
        const data = goals.map(goal => ({
            Título: goal.title,
            Descrição: goal.description ?? "",
            "Data de Conclusão": goal.dueDate.toISOString().split('T')[0],
            Tipo: goal.type,
            "IDs de Referência": goal?.referenceIds?.join(", "),
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Goals");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "metas.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting goals to Excel:", error);
    }
}
