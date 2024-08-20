import { ThreeDots } from "react-loader-spinner";
import { deleteGoal } from "@/app/api/GoalsService";
import GoalModal from "./GoalModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { openConfirmationAlert } from "../common/ConfirmationAlert";
import { LucideDelete, LucideEdit } from "lucide-react";
import { Goal } from "@/app/types/goal";

interface GoalsTableProps {
  goals: Goal[];
  isLoading: boolean;
  updateGoals: () => void;
}

const GoalsTable: React.FC<GoalsTableProps> = ({ goals, isLoading, updateGoals }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    openModal();
  };

  const confirmDelete = async (id: string) => {
    await handleDelete(id);
    toast.success("Meta excluída com sucesso")
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      updateGoals();
    } catch (error) {
      toast.error(`Erro ao excluir meta ${error}`);
    }
  };

  return (
    isLoading ? (
      <div className='flex justify-center'>
        <ThreeDots
          height="80"
          width="20"
          radius="9"
          color="black"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    ) : (
      <div className="mt-10 flex flex-col bg-clip-border rounded-xl bg-purple-50 shadow-md xl:col-span-2 overflow-y-auto scrollbar-thumb-purple-500 dark:text-white dark:bg-black ">
        <table className="w-full h-full">
          <thead className='bg-purple-200 uppercase dark:bg-gradient-to-tr dark:from-purple-700 dark:to-purple-950 '>
            <tr className='text-purple-950 text-[15px]'>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Nome</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Meta</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Descrição</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Alvo</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Responsáveis</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Alcançado</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Vencimento</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
              </th>
            </tr>
          </thead>
          <tbody className='capitalize align-top'>
            {goals?.map((goal, index) => (
              <tr key={index} className={index % 2 ? "dark:bg-purple-950" : ""}>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{goal.title}</p>
                  </div >
                </td>

                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{goal.expectedGoal}</p>
                  </div >
                </td>

                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{goal.description}</p>
                  </div>
                </td>
                
                <td className="py-3 px-5 border-b dark:border-none max">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{goal.target === 'leader' ? ("Pessoal") : ("Time")}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex flex-wrap items-center gap-4 justify-center max-h-12 overflow-y-auto" title={ JSON.stringify(goal?.referenceDetails?.map(item => item.name).join(','))}>
                    {goal?.referenceDetails?.map((reference) => (
                      <span
                        key={reference.id}
                        className="inline-block bg-purple-600 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {reference.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    { goal?.totalProgress }
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal">
                      {(new Date(goal.dueDate)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: "numeric" })}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none ">
                  <div className="flex space-x-2 justify-center">
                    <button onClick={() => openConfirmationAlert({
                      title: "Confirmar exclusão",
                      question: "Tem certeza que deseja excluir esta meta?",
                      classButtonConfirm: "CANCEL",
                      classButtonCancel: "CONFIRM",
                      confirmMethod: () => confirmDelete(goal.id)
                    })}
                      className="text-red-600 hover:text-red-900 focus:outline-none">
                      <LucideDelete />
                    </button>
                    <button onClick={() => openEditModal(goal.id)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                      <LucideEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && (
          <GoalModal
            isOpen={modalOpen}
            onClose={closeModal}
            updateGoals={updateGoals}
            initialGoal={goals.find(c => c.id === selectedGoalId)}
          />
        )}
      </div>
    )
  );
}

export default GoalsTable;
