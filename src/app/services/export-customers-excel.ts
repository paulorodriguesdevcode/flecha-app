import { Customer } from "../types/customer";
import * as XLSX from "xlsx";

export async function exportCustomersToExcel(customers: Customer[]) {
    try {
        const data = customers.map(customer => ({
            Nome: customer.name,
            Email: customer.email,
            Telefone: customer.phone,
            Documento: customer.document,
            "Data de cadastro": customer.createdAt ?? "",
            Cidade: customer.city ?? ""
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clientes.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) { 
        console.error("Error exporting customers to Excel:", error);
    }
}
