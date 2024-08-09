"use client";

import { useEffect, useState } from "react";
import GoalTable from "@/app/components/goals/GoalTable";
import Card from "../components/common/Card";
import { listGoals } from "../api/GoalsService";
import { toast } from "react-toastify";
import { Goal } from "../types/goal";
import GoalModal from "../components/goals/GoalModal";
import LaunchGoalModal from "../components/goals/LaunchGoalModal";
import Button from "../components/common/Button";
import { Target } from "lucide-react";
import { exportGoalsToExcel } from "../services/export-goals-excel";

export default function Page() {
  const [modalGoalOpen, setModalGoalOpen] = useState(false);
  const [modalLaunchGoalOpen, setModalLaunchGoalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const openModalGoal = () => setModalGoalOpen(true);
  const openModalLaunchGoal = () => setModalLaunchGoalOpen(true);
  const closeModalGoal = () => setModalGoalOpen(false);
  const closeModalLaunchGoal = () => setModalLaunchGoalOpen(false);

  async function fetchGoals() {
    try {
      const goalsFromDb = await listGoals();
      setGoals(goalsFromDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar metas");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de metas" value={goals?.length?.toString()} icon={Target} />
          </div>

          <div className="flex-wrap">
            <div className="flex">
              <Button text="Lançar resultado" type={"CONFIRM"} onClick={openModalLaunchGoal} />
              <Button text="Cadastrar Nova Meta" type={"CONFIRM"} onClick={openModalGoal} specialClass="ml-4" />
              <Button text="Exportar em excel" type={"CONFIRM"} onClick={() => exportGoalsToExcel(goals)} specialClass="ml-4" />
            </div>

            <GoalTable goals={goals} isLoading={isLoading} updateGoals={() => fetchGoals()} />
          </div>
        </div>
      </div>

      <GoalModal isOpen={modalGoalOpen} onClose={closeModalGoal} updateGoals={() => fetchGoals()} />
      <LaunchGoalModal
        isOpen={modalLaunchGoalOpen}
        onClose={closeModalLaunchGoal}
        goals={goals}
        setGoals={setGoals}
        fetchGoals={() => fetchGoals()}
      />
    </div>
  );
}
