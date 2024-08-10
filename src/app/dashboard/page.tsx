"use client"

import { Users, Goal as GoalIcon, Shield } from "lucide-react";
import Card from "../components/common/Card";
import { useEffect, useState } from "react";
import { getTotalLeaders } from "../api/LeadersService";
import { getTotalGoals } from "../api/GoalsService";
import { listGoals } from "../api/GoalsService";
import { Goal } from "../types/goal";

export default function Page() {
  const [totalTeams, setTotalTeams] = useState<number>(0)
  const [totalLeaders, setTotalLeaders] = useState<number>(0)
  const [totalGoals, setTotalGoals] = useState<number>(0)
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchTotalTeams = async () => {
      try {
        const total = await getTotalLeaders();
        setTotalTeams(total);
      } catch (error) {
        console.error('Erro ao tentar listar times', error);
      }
    };

    fetchTotalTeams();
  }, []);

  useEffect(() => {
    const fetchTotalLeaders = async () => {
      try {
        const total = await getTotalLeaders();
        setTotalLeaders(total);
      } catch (error) {
        console.error('Erro ao tentar listar lideres', error);
      }
    };

    fetchTotalLeaders();
  }, []);

  useEffect(() => {
    const fetchTotalGoals = async () => {
      try {
        const total = await getTotalGoals();
        setTotalGoals(total);
      } catch (error) {
        console.error('Erro ao tentar listar metas', error);
      }
    };

    fetchTotalGoals();
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsData = await listGoals();
        setGoals(goalsData);
      } catch (error) {
        console.error('Erro ao tentar listar metas', error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={false} title="Total de equipes" value={totalTeams.toString()} icon={Shield} />
            <Card isLoading={false} title="Total de lideres" value={totalLeaders.toString()} icon={Users} />
            <Card isLoading={false} title="Total de metas" value={totalGoals.toString()} icon={GoalIcon} />
          </div>
          <div className="mb-12">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
                <details className="group">
                  <summary className="text-lg font-semibold text-purple-900 cursor-pointer">
                    {goal.title}
                    <span className="ml-2 text-sm text-purple-600 group-open:hidden">(expandir)</span>
                    <span className="ml-2 text-sm text-purple-600 hidden group-open:inline">(recolher)</span>
                  </summary>
                  <div className="mt-2">
                    <p className="text-sm text-purple-700">{goal.description}</p>
                    <p className="text-sm text-purple-700">
                      Data fim: {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-purple-700">
                      Meta esperada: {goal.expectedGoal}
                    </p>
                    {(goal?.progress?.length && goal?.progress?.length > 0) ? (
                      <p className="text-sm text-purple-700">Progresso atual: {goal.totalProgress}</p>
                    ):("")}
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-purple-800">Progresso por responsável:</h4>
                      <ul className="list-disc pl-5">
                        {goal?.progress?.map((progressItem) => (
                          <li key={progressItem._id} className="text-sm text-purple-600">
                            {
                              goal?.referenceDetails?.find(
                                (ref) => ref.id === progressItem.referenceId
                              )?.name
                            }: {progressItem.amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
