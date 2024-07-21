import { useState, useEffect } from "react";
import { createOrder } from "@/app/api/OrdersService";
import { listCustomers } from "@/app/api/CustomersService";
import { Customer } from "@/app/types/customer";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import { toFormattedPrice } from "@/common/number";
import { ArrowDownSquare } from "lucide-react";
import Button from "../common/Button";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateOrders: () => void;
}
export default function OrdersModal({ isOpen, onClose, updateOrders }: OrdersModalProps) {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [startWorkDateTime, setStartWorkDateTime] = useState("");
  const [endWorkDateTime, setEndWorkDateTime] = useState("");
  const [parts, setParts] = useState<string[]>([""]);

  async function fetchCustomers() {
    try {
      const customersFromDb = await listCustomers();
      setCustomers(customersFromDb);
      if (customersFromDb.length > 0) {
        setCustomerId(customersFromDb[0].id);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar clientes");
      }
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const resetModal = () => {
    setPrice("");
    setDescription("");
    setCustomerId(customers.length > 0 ? customers[0].id : "");
    setParts([""]);
    setStartWorkDateTime('')
    setEndWorkDateTime('')
  };

  const closeAndResetModal = () => {
    resetModal();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (new Date(endWorkDateTime) < new Date(startWorkDateTime)) {
      setError("A data de fim não pode ser menor que a data de início.");
      setLoading(false);
      return;
    }

    try {
      const priceFormatted = toFormattedPrice(price)
      await createOrder({ price: priceFormatted, description, customerId, parts, startWorkDateTime, endWorkDateTime });
      toast.success("Ordem criada com sucesso!");
      updateOrders();
      resetModal();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao salvar ordem");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = () => {
    setParts([...parts, ""]);
  };

  const handlePartChange = (index: number, value: string) => {
    const updatedParts = [...parts];
    updatedParts[index] = value;
    setParts(updatedParts);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-1 flex items-center justify-center z-50 bg-purple-950 bg-opacity-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full ">
        <h2 className="text-xl mb-4 text-purple-950 font-bold uppercase">Cadastrar Nova O.S</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          <div className="mb-4">
            <label className="block text-purple-950">Valor</label>
            <InputMask
              mask="R$ 9.999,99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Cliente</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700"
              required
            >
              <option value="" disabled>Selecione um cliente</option>
              {customers.map(customer => (
                <option value={customer.id} key={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Horário de início</label>
            <input
              type="datetime-local"
              value={startWorkDateTime}
              onChange={(e) => setStartWorkDateTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Horário de fim</label>
            <input
              type="datetime-local"
              value={endWorkDateTime}
              onChange={(e) => setEndWorkDateTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-purple-950">Peças com avarias</label>
              <div className="text-purple-700 cursor-pointer" title="Clique para adicionar nova peça">
                <ArrowDownSquare onClick={handleAddPart}/>
              </div>
            </div>
            {parts.map((part, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={part}
                  onChange={(e) => handlePartChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mr-2 focus:outline-purple-700"
                  placeholder="Insira o nome da peça"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 flex justify-start mb-4">* {error}</p>}

          <div className="flex justify-end">
            <button type="submit" className="mr-4 px-4 py-2 bg-purple-500 text-white font-bold rounded-lg" disabled={loading}>
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Cadastrar"
              )}
            </button>
            <Button text="Cancelar" onClick={closeAndResetModal} type="INFO" specialClass=""/>
          </div>
        </form>
      </div>
    </div>

  );
}
