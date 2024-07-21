import { formatToBRDate } from "@/common/datetime";
import { ThreeDots } from "react-loader-spinner";
import { deleteCustomer } from "@/app/api/CustomersService";
import { Customer } from "@/app/types/customer";
import CustomerModal from "./CustomerModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { openConfirmationAlert } from "../common/ConfirmationAlert";
import { LucideDelete, LucideEdit } from "lucide-react";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  updateCustomers: () => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ customers, isLoading, updateCustomers }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    openModal();
  };

  const confirmDelete = async (id: string) => {
    await handleDelete(id);
    toast.success("Cliente excluido com sucesso")
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      updateCustomers();
    } catch (error) {
      toast.error(`Erro ao excluir cliente ${error}`);
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
                <p className="block font-sans text-purple-gray-400 dark:text-white">CNPJ</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Telefone</p>
              </th>
              
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Email</p>
              </th>

              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Cidade</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">data</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
              </th>
            </tr>
          </thead>
          <tbody className='capitalize align-top'>
            {customers.map((customer, index) => (
              <tr key={index} className={index % 2 ? "dark:bg-purple-950" : ""}>
                <td className="py-3 px-5 border-b">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal ">{customer.name}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="w-10/12 justify-center">
                    <p className="font-sans mb-1 block text-xs font-medium text-center">{customer.document}</p>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                      <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <p className="block font-sans text-xs font-medium text-center">{customer.phone}</p>
                </td>
                
                <td className="py-3 px-5 border-b">
                  <div className="w-10/12">
                    <p className="font-sans mb-1 block text-xs font-medium text-center lowercase">{customer.email}</p>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                      <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="w-10/12">
                    <p className="font-sans mb-1 block text-xs font-medium text-center">{customer.city}</p>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                      <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="w-10/12">
                    <p className="font-sans mb-1 block text-xs font-medium text-center">{formatToBRDate(customer.createdAt)}</p>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                      <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 border-b ">
                  <div className="flex space-x-2 justify-center">
                    <button onClick={() => openConfirmationAlert({
                      title: "Confirmar exclusão",
                      question: "Tem certeza que deseja excluir este cliente e todas as suas ordens de serviço?",
                      classButtonConfirm: "CANCEL",
                      classButtonCancel: "CONFIRM",
                      confirmMethod: () => confirmDelete(customer.id)
                    })}
                      className="text-red-600 hover:text-red-900 focus:outline-none">
                      <LucideDelete/>
                    </button>
                    <button onClick={() => openEditModal(customer.id)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                      <LucideEdit/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && (
          <CustomerModal
            isOpen={modalOpen}
            onClose={closeModal}
            updateCustomers={updateCustomers}
            initialCustomer={customers.find(c => c.id === selectedCustomerId)}
          />
        )}
      </div>
    )
  );
}

export default CustomersTable;
