import * as XLSX from "xlsx";
import { Team } from "../types/team";

export async function exportTeamsToExcel(teams: Team[]) {
    try {
        const data = teams.map(team => ({
            Nome: team.name,
            Id: team.id,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leaders");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "teams.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) { 
        console.error("Error exporting leaders to Excel:", error);
    }
}
