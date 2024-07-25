import Cookies from "js-cookie";
import { Leader } from "../types/leader";
import { logoff } from "../components/common/Logoff";

export async function createLeader(leader: Omit<Leader, "id">)  {
    const token = Cookies.get("token");

    const response = await fetch(`${process.env.API_URL}/leaders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(leader),
    });

    return response
}

export async function listLeaders()  {
    const token = Cookies.get("token");

    const response = await (await fetch(`${process.env.API_URL}/leaders`, {
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

export async function getTotalLeaders()  {
    const token = Cookies.get("token");

    const response = await (await fetch(`${process.env.API_URL}/leaders/total`, {
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

export async function deleteLeader(id: string)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/leaders/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
}

export async function updateLeader(leader:Leader)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/leaders/${leader.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(leader),
    });
}