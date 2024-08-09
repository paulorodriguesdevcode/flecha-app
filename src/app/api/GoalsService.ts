import Cookies from "js-cookie";
import { Goal, Progress } from "../types/goal";
import { logoff } from "../components/common/Logoff";

export async function createGoal(goal: Omit<Goal, "id">) {
  const token = Cookies.get("token");

  const response = await fetch(`${process.env.API_URL}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });

  return response;
}

export async function listGoals() {
  const token = Cookies.get("token");

  const response = await (await fetch(`${process.env.API_URL}/goals`, {
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

export async function getTotalGoals() {
  const token = Cookies.get("token");

  const response = await (await fetch(`${process.env.API_URL}/goals/total`, {
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

export async function deleteGoal(id: string) {
  const token = Cookies.get("token");

  return await fetch(`${process.env.API_URL}/goals/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function updateGoal(goal: Goal) {
  const token = Cookies.get("token");

  return await fetch(`${process.env.API_URL}/goals/${goal.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });
}


export async function addProgress(progress: Progress) {
  const token = Cookies.get("token");

  return await fetch(`${process.env.API_URL}/goals/add-progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(progress),
  });
}