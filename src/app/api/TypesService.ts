import Cookies from "js-cookie";
import { logoff } from "../components/common/Logoff";
import { GoalType } from "../types/goal";

export async function createType(type: Omit<GoalType, "id">) {
  const token = Cookies.get("token");

  const response = await fetch(`${process.env.API_URL}/goals/types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(type),
  });

  return response;
}

export async function listTypes() {
  const token = Cookies.get("token");
  console.log('listTypes')
  const response = await (await fetch(`${process.env.API_URL}/goals/types`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })).json();

  console.log(response)

  if (response?.statusCode === 401) {
    logoff();
    throw new Error("Sua sessão expirou, faça login novamente.");
  }

  return response;
}

export async function getTotalTypes() {
  const token = Cookies.get("token");

  const response = await (await fetch(`${process.env.API_URL}/goals/types/total`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })).json();

  if (response?.statusCode === 401) {
    logoff();
    throw new Error("Sua sessão expirou, faça login novamente.");
  }

  return response;
}

export async function deleteType(id: string) {
  const token = Cookies.get("token");

  return await fetch(`${process.env.API_URL}/goals/types/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function updateType(type: GoalType) {
  const token = Cookies.get("token");

  return await fetch(`${process.env.API_URL}/goals/types/${type.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(type),
  });
}
