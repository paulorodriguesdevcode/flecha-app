import Cookies from "js-cookie";
import { Order } from "../types/order";
import { logoff } from "../components/common/Logoff";

export async function createOrder(order: Omit<Order, "id" | "number">) {
    const token = Cookies.get("token");

    const response = await fetch(`${process.env.API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(order),
    });

    return response
}

export async function listOrders() {
    const token = Cookies.get("token");

    const response = await (await fetch(`${process.env.API_URL}/orders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    })).json();

    if (response?.statusCode === 401) {
        logoff()

        throw new Error("Sua sessão expirou, faça login novamente.")
    }

    return response
}

export async function deleteOrder(id: string) {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
}

export async function sendOrderByEmail(number: number | undefined, signature: string) {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/orders/send/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ number, signature }),
    });
}