import Cookies from "js-cookie";
import { logoff } from "../components/common/Logoff";
import { Team } from "../types/team";

export async function createTeam(team: Omit<Team, "id">)  {
    const token = Cookies.get("token");

    const response = await fetch(`${process.env.API_URL}/teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(team),
    });

    return response
}

export async function listTeams()  {
    const token = Cookies.get("token");

    const response = await (await fetch(`${process.env.API_URL}/teams`, {
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

export async function deleteTeam(id: string)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/teams/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
}

export async function updateTeam(team:Team)  {
    const token = Cookies.get("token");

    return await fetch(`${process.env.API_URL}/teams/${team.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(team),
    });
}