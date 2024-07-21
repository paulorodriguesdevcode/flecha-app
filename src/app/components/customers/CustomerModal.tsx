import { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { createCustomer, updateCustomer } from "@/app/api/CustomersService";
import { Customer } from "@/app/types/customer";
import { toast } from "react-toastify";
import Button from "../common/Button";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateCustomers: () => void;
  initialCustomer?: Customer;
}

export default function CustomerModal({ isOpen, onClose, updateCustomers, initialCustomer }: CustomerModalProps) {
  const [name, setName] = useState(initialCustomer?.name || "");
  const [email, setEmail] = useState(initialCustomer?.email || "");
  const [phone, setPhone] = useState(initialCustomer?.phone || "");
  const [document, setDocument] = useState(initialCustomer?.document || "");
  const [city, setCity] = useState(initialCustomer?.city || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<Customer | undefined>(initialCustomer);

  useEffect(() => {
    if (initialCustomer) {
      setCustomer(initialCustomer);
    } else {
      setCustomer(undefined);
    }
  }, [initialCustomer]);

  const resetModal = () => {
    setDocument("");
    setEmail("");
    setName("");
    setPhone("");
    setCity("");
    setCustomer(undefined);
  };

  const closeAndResetModal = () => { resetModal(); onClose() }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (customer) {
        await updateCustomer({ id: customer.id, document, email, name, phone, city });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await createCustomer({ document, email, name, phone, city });
        toast.success("Cliente criado com sucesso!");
      }

      updateCustomers();
      resetModal();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao salvar cliente");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-purple-950 font-bold uppercase">
          {customer ? `Editar Cliente - ${customer?.name?.split(" ")[0]}` : "Cadastrar Novo Cliente"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-950">Nome</label>
            <input
              type="text"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950 ">Telefone</label>
            <InputMask
              value={phone}
              mask="(99) 9999-9999"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">CNPJ</label>
            <InputMask
              mask="99.999.999/9999-99"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Email</label>
            <InputMask
              mask=''
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950">Cidade</label>
            <input
              value={city}
              maxLength={20}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900"
              required
            />
          </div>

          {error && <p className="text-red-500 flex justify-center mb-4">{error}</p>}
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
                customer ? "Salvar" : "Cadastrar"
              )}
            </button>
            <Button text="Cancelar" onClick={closeAndResetModal} type="INFO" specialClass=""/>
          </div>
        </form>
      </div>
    </div>
  );
}
