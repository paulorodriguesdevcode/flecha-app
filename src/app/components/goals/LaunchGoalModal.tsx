import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { addProgress } from "@/app/api/GoalsService";
import { Goal } from "@/app/types/goal";
import { toast } from "react-toastify";
import Button from "../common/Button";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[]
  setGoals:Dispatch<SetStateAction<Goal[]>>
  fetchGoals:() => Promise<void>
}

export default function GoalModal({ isOpen, onClose, goals, fetchGoals}: GoalModalProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [reference, setReference] = useState<any[]>([]);
  const [selectedResponsible, setSelectedResponsible] = useState<string>("");
  const [result, setResult] = useState<number>(0);

  const resetModal = () => {
    setSelectedGoal("");
    setSelectedResponsible("")
    setResult(0)
  };

  useEffect(() => {
    if (selectedGoal) {
      const alvo = goals.filter(goal => goal.id === selectedGoal)
      setReference(alvo)
    }

  }, [selectedGoal, selectedResponsible, goals])

  const closeAndResetModal = () => {
    resetModal();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addProgress({ goalId: selectedGoal, referenceId: selectedResponsible, amount: result });
    fetchGoals()
    toast.success("Resultado lançado com sucesso!");
    closeAndResetModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl mb-4 text-purple-950 dark:text-purple-300 font-bold uppercase">
          Lançar resultado
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="goal" className="block text-sm font-medium text-purple-300">
              Selecione a Meta
            </label>
            <select
              id="goal"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-purple-200 dark:text-purple-900"
            >
              <option value="">Selecione uma meta</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div> 

          {selectedGoal && (
            <div className="mb-4">
              <label htmlFor="goal" className="block text-sm font-medium text-purple-300">
                Selecione a pessoa/equipe
              </label>
              <select
                id="goal"
                value={selectedResponsible}
                onChange={(e) => setSelectedResponsible(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-purple-200 dark:text-purple-900"
              >
                <option value="">Selecione o responsável</option>
                {reference[0]?.referenceDetails?.map((reference: any) => (
                  <option key={reference.id} value={reference.id}>
                    {reference.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Resultado</label>
            <input
              type="text"
              value={result}
              onChange={(e) => setResult(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-purple-900 dark:border-gray-600 dark:bg-purple-200"
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="submit">cadastrar</button>
            <Button text="Cancelar" onClick={closeAndResetModal} type="INFO" specialClass="ml-10" />
          </div>
        </form>
      </div>
    </div>
  );
}