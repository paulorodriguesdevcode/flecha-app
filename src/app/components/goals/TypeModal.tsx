import { useState, useEffect } from "react";
import { createType, updateType } from "@/app/api/TypesService";
import { GoalType } from "@/app/types/goal";
import { toast } from "react-toastify";
import Button from "../common/Button";

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateTypes: () => void;
  initialType?: GoalType;
}

export default function TypeModal({ isOpen, onClose, updateTypes, initialType }: TypeModalProps) {
  const [name, setName] = useState(initialType?.name || undefined);
  const [description, setDescription] = useState(initialType?.description || undefined);
  const [id, setId] = useState(initialType?.id || undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialType) {
      setName(initialType?.name);
      setId(initialType?.id);
    }
  }, [initialType]);

  const resetModal = () => {
    setId("");
    setName("");
  };

  const closeAndResetModal = () => {
    resetModal();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (id) {
        await updateType({ id, name });
        toast.success("Tipo atualizado com sucesso!");
      } else {
        await createType({ name, description });
        toast.success("Tipo criado com sucesso!");
      }

      updateTypes();
      closeAndResetModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao salvar tipo");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl mb-4 text-purple-950 dark:text-purple-300 font-bold uppercase">
          {id ? `Editar Tipo - ${name}` : "Cadastrar Novo Tipo"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Nome</label>
            <input
              type="text"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
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
                id ? "Salvar" : "Cadastrar"
              )}
            </button>
            <Button text="Cancelar" onClick={closeAndResetModal} type="INFO" specialClass="" />
          </div>
        </form>
      </div>
    </div>
  );
}
