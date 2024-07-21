import Cookies from "js-cookie";
import { Customer } from "../types/customer";
import { logoff } from "../components/common/Logoff";

export async function createCustomer(customer: Omit<Customer, "id">)  {
    const token = Cookies.get("token");

    const response = await fetch(`${process.env.API_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
    });

    return response
}

export async function listCustomers()  {
    const token = Cookies.get("token");

    const response = await (await fetch(`${process.env.API_URL}/customers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    })).json();

    if(response?.statusCode === 401){
       logoff()
        throw new Error("Sua sessão expirou, faça login novamente.")
    }

    return response
}

export async function deleteCustomer(id: string)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
}

export async function updateCustomer(customer:Customer)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/customers/${customer.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
    });
}