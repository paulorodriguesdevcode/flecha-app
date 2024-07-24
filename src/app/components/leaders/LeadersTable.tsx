import { ThreeDots } from "react-loader-spinner";
import { deleteLeader } from "@/app/api/LeadersService";
import { Leader } from "@/app/types/leader";
import LeaderModal from "./LeaderModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { openConfirmationAlert } from "../common/ConfirmationAlert";
import { LucideDelete, LucideEdit } from "lucide-react";

interface LeadersTableProps {
  leaders: Leader[];
  isLoading: boolean;
  updateLeaders: () => void;
}

const LeadersTable: React.FC<LeadersTableProps> = ({ leaders, isLoading, updateLeaders }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = (leaderId: string) => {
    setSelectedLeaderId(leaderId);
    openModal();
  };

  const confirmDelete = async (id: string) => {
    await handleDelete(id);
    toast.success("Lider excluido com sucesso")
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLeader(id);
      updateLeaders();
    } catch (error) {
      toast.error(`Erro ao excluir lider ${error}`);
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
                <p className="block font-sans text-purple-gray-400 dark:text-white">Email</p>
              </th>

              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Times</p>
              </th>

              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
              </th>
            </tr>
          </thead>
          <tbody className='capitalize align-top'>
            {leaders?.map((leader, index) => (
              <tr key={index} className={index % 2 ? "dark:bg-purple-950" : ""}>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{leader.name}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal lowercase">{leader.email}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    {leader?.teams?.map((team) => (
                      <span
                        key={team.id}
                        className="inline-block bg-purple-600 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {team.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none ">
                  <div className="flex space-x-2 justify-center">
                    <button onClick={() => openConfirmationAlert({
                      title: "Confirmar exclusão",
                      question: "Tem certeza que deseja excluir este lider e todas as suas equipes?",
                      classButtonConfirm: "CANCEL",
                      classButtonCancel: "CONFIRM",
                      confirmMethod: () => confirmDelete(leader.id)
                    })}
                      className="text-red-600 hover:text-red-900 focus:outline-none">
                      <LucideDelete />
                    </button>
                    <button onClick={() => openEditModal(leader.id)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                      <LucideEdit />
                    </button>
                  </div>
                </td>
              </tr>
            )
            )}
          </tbody>
        </table>
        {modalOpen && (
          <LeaderModal
            isOpen={modalOpen}
            onClose={closeModal}
            updateLeaders={updateLeaders}
            initialLeader={leaders.find(c => c.id === selectedLeaderId)}
          />
        )}
      </div>
    )
  );
}

export default LeadersTable;
