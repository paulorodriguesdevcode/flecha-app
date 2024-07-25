import { ThreeDots } from "react-loader-spinner";
import { deleteTeam } from "@/app/api/TeamsService";
import TeamModal from "./TeamModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { openConfirmationAlert } from "../common/ConfirmationAlert";
import { LucideDelete, LucideEdit } from "lucide-react";
import { Team } from "@/app/types/team";

interface TeamsTableProps {
  teams: Team[];
  isLoading: boolean;
  updateTeams: () => void;
}

const TeamsTable: React.FC<TeamsTableProps> = ({ teams, isLoading, updateTeams }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = (teamId: string) => {
    setSelectedTeamId(teamId);
    openModal();
  };

  const confirmDelete = async (id: string) => {
    await handleDelete(id);
    toast.success("Equipe excluida com sucesso")
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam(id);
      updateTeams();
    } catch (error) {
      toast.error(`Erro ao excluir equipe ${error}`);
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
                <p className="block font-sans text-purple-gray-400 dark:text-white ">Liderança</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
              </th>
            </tr>
          </thead>
          <tbody className='capitalize align-top'>
            {teams?.map((team, index) => (
              <tr key={index} className={index % 2 ? "dark:bg-purple-950" : ""}>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{team.name}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none">
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    {team?.leaders?.map((leader) => (
                      <span
                        key={leader.id}
                        className="inline-block bg-purple-600 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {leader.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 border-b dark:border-none ">
                  <div className="flex space-x-2 justify-center">
                    <button onClick={() => openConfirmationAlert({
                      title: "Confirmar exclusão",
                      question: "Tem certeza que deseja excluir esta equipe?",
                      classButtonConfirm: "CANCEL",
                      classButtonCancel: "CONFIRM",
                      confirmMethod: () => confirmDelete(team.id)
                    })}
                      className="text-red-600 hover:text-red-900 focus:outline-none">
                      <LucideDelete />
                    </button>
                    <button onClick={() => openEditModal(team.id)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                      <LucideEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && (
          <TeamModal
            isOpen={modalOpen}
            onClose={closeModal}
            updateTeams={updateTeams}
            initialTeam={teams.find(c => c.id === selectedTeamId)}
          />
        )}
      </div>
    )
  );
}

export default TeamsTable;
