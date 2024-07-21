import * as XLSX from "xlsx";
import { Order } from "../types/order";
import { toast } from "react-toastify";

export async function exportOrdersToExcel(orders: Order[]) {
    try {
        const data = orders.map(order => ({
            Customer: order.customer,
            Description: order.description,
            Id: order.id,
            Price: order.price,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");

        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ordens.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) { 
        toast.error(`Error exporting orders to Excel: ${JSON.stringify(error)}`, );
    }
}
