import { ThreeDots } from "react-loader-spinner";
import { deleteType } from "@/app/api/TypesService";
import TypeModal from "./TypeModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { openConfirmationAlert } from "../common/ConfirmationAlert";
import { LucideDelete, LucideEdit } from "lucide-react";
import { GoalType } from "@/app/types/goal";

interface TypesTableProps {
  types: GoalType[];
  isLoading: boolean;
  updateTypes: () => void;
}

const TypesTable: React.FC<TypesTableProps> = ({ types, isLoading, updateTypes }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = (typeId: string|undefined) => {
    if(!typeId){return}
    setSelectedTypeId(typeId);
    openModal();
  };

  const confirmDelete = async (id: string|undefined) => {
    if(!id){return}
    await handleDelete(id);
    toast.success("Tipo excluído com sucesso");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteType(id);
      updateTypes();
    } catch (error) {
      toast.error(`Erro ao excluir tipo ${error}`);
    }
  };

  return isLoading ? (
    <div className="flex justify-center">
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
    <div className="mt-10 flex flex-col bg-clip-border rounded-xl bg-purple-50 shadow-md xl:col-span-2 overflow-y-auto scrollbar-thumb-purple-500 dark:text-white dark:bg-black">
      <table className="w-full h-full">
        <thead className="bg-purple-200 uppercase dark:bg-gradient-to-tr dark:from-purple-700 dark:to-purple-950">
          <tr className="text-purple-950 text-[15px]">
            <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
              <p className="block font-sans text-purple-gray-400 dark:text-white">Nome</p>
            </th>
            <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
              <p className="block font-sans text-purple-gray-400 dark:text-white">Descrição</p>
            </th>
            <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
              <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
            </th>
          </tr>
        </thead>
        <tbody className="capitalize align-top">
          {types?.map((type, index) => (
            <tr key={index} className={index % 2 ? "dark:bg-purple-950" : ""}>
              <td className="py-3 px-5 border-b dark:border-none">
                <div className="flex items-center gap-4 justify-center">
                  <p className="block font-sans text-sm leading-normal">{type.name}</p>
                </div>
              </td>

              <td className="py-3 px-5 border-b dark:border-none">
                <div className="flex items-center gap-4 justify-center">
                  <p className="block font-sans text-sm leading-normal">{type.description}</p>
                </div>
              </td>

              <td className="py-3 px-5 border-b dark:border-none">
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={() =>
                      openConfirmationAlert({
                        title: "Confirmar exclusão",
                        question: "Tem certeza que deseja excluir este tipo?",
                        classButtonConfirm: "CANCEL",
                        classButtonCancel: "CONFIRM",
                        confirmMethod: () => confirmDelete(type.id),
                      })
                    }
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    <LucideDelete />
                  </button>
                  <button onClick={() => openEditModal(type?.id)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                    <LucideEdit />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <TypeModal
          isOpen={modalOpen}
          onClose={closeModal}
          updateTypes={updateTypes}
          initialType={types.find((t) => t.id === selectedTypeId)}
        />
      )}
    </div>
  );
};

export default TypesTable;
