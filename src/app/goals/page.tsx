"use client"

import { useEffect, useState } from "react";
import GoalTable from "@/app/components/goals/GoalTable";
import Card from "../components/common/Card";
import { listGoals } from "../api/GoalsService";
import { toast } from "react-toastify";
import { Goal } from "../types/goal";
import GoalModal from "../components/goals/GoalModal";
import Button from "../components/common/Button";
import { Target } from "lucide-react";
import { exportGoalsToExcel } from "../services/export-goals-excel";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setModalOpen(true);
  const closeModal = () => { setModalOpen(false) };

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
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de metas" value={goals?.length?.toString()} icon={Target} />
          </div>

          <div className='flex-wrap'>
            <div className='flex'>
              <Button text='Cadastrar Nova Meta' type={"CONFIRM"} onClick={openModal} />
              <Button text='Exportar em excel' type={"CONFIRM"} onClick={() => exportGoalsToExcel(goals)} specialClass="ml-6" />
            </div>

            <GoalTable goals={goals} isLoading={isLoading} updateGoals={() => fetchGoals()} />
          </div>
        </div>
      </div>
      <GoalModal isOpen={modalOpen} onClose={closeModal} updateGoals={() => fetchGoals()} />

    </div>
  );
}
