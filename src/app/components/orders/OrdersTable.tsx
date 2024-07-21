import { ThreeDots } from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert";
import { deleteOrder, sendOrderByEmail } from "@/app/api/OrdersService";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../common/Button";
import OrdersModal from "./OrdersModal";
import SignatureModal from "./SignatureModal";
import { Order } from "@/app/types/order";
import { LucideDelete, Mail } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  updateOrders: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, updateOrders }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [orderEmailTarget, setOrderEmailTarget] = useState<Order>()

  const closeModal = () => setModalOpen(false);
  const closeSignatureModal = () => setSignatureModalOpen(false);

  const openConfirmationAlert = (id: string) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl mb-4 text-purple-950 font-bold uppercase'>Confirmar exclusão</h2>
          <p className='text-red-500'>
            Tem certeza que deseja excluir esta ordem de serviço?
          </p>
          <div className='mt-6 flex justify-end'>
            <Button text='Confirmar' type={"CANCEL"} onClick={() => { handleDelete(id); onClose(); toast.success("Ordem excluida com sucesso") }} />
            <Button text='Cancelar' type={"CONFIRM"} onClick={() => onClose()} specialClass='ml-2' />
          </div>
        </div>
      ),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      updateOrders();
    } catch (error) {
      toast.error(`Erro ao excluir ordem de serviço ${error}`);
    }
  };

  const sendByEmail = async (order: Order) => {
    setSignatureModalOpen(true);
    setOrderEmailTarget(order)
  };

  const handleSaveSignature = async (signature: string) => {
    await sendOrderByEmail(orderEmailTarget?.number, signature)
    toast.success("O.S enviada por email com assinatura");
  }

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
          <thead className='bg-purple-200 uppercase dark:bg-gradient-to-tr dark:from-purple-700 dark:to-purple-950'>
            <tr className='text-purple-950 text-[15px]'>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">O.S</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Cliente</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Cidade</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Descrição</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Valor</p>
              </th>
              <th className="border-b border-purple-gray-50 dark:border-transparent py-3 px-6 text-center">
                <p className="block font-sans text-purple-gray-400 dark:text-white">Ações</p>
              </th>
            </tr>
          </thead>
          <tbody className='capitalize align-top'>
            {orders.map((order, index) => (
              <tr key={index} className={index % 2 ? " dark:bg-purple-950" : ""}>
                <td className="py-3 px-5 border-b">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal">{order.number}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal">{order.customer?.name}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="flex items-center gap-4 justify-center">
                    <p className="block font-sans text-sm leading-normal">{order.customer?.city}</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <p className="block font-sans text-xs font-medium text-blue-gray-600 text-center">{order.description}</p>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="w-10/12">
                    <p className="font-sans mb-1 block text-xs font-medium text-blue-gray-600 text-center">{'R$ ' + order.price.toFixed(2)}</p>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                      <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 border-b">
                  <div className="flex space-x-2 justify-center">
                    <button onClick={() => openConfirmationAlert(order.id)} className="text-red-600 hover:text-red-900 focus:outline-none">
                      <LucideDelete/>
                    </button>
                    <button onClick={() => sendByEmail(order)} className="text-purple-600 hover:text-purple-900 focus:outline-none">
                    <Mail/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <OrdersModal
            isOpen={modalOpen}
            onClose={closeModal}
            updateOrders={updateOrders}
          />
        )}

        <SignatureModal
          isOpen={signatureModalOpen}
          onClose={closeSignatureModal}
          onSave={handleSaveSignature}
          orderEmailTarget={orderEmailTarget}
        />
      </div>
    )
  );

}

export default OrdersTable;
