import { useState, useEffect } from "react";
import { createTeam, updateTeam } from "@/app/api/TeamsService";
import { Team } from "@/app/types/team";
import { toast } from "react-toastify";
import Button from "../common/Button";
import { listLeaders } from "@/app/api/LeadersService";
import { Leader } from "@/app/types/leader";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateTeams: () => void;
  initialTeam?: Team;
}

export default function TeamModal({ isOpen, onClose, updateTeams, initialTeam }: TeamModalProps) {
  const [name, setName] = useState(initialTeam?.name || "");
  const [id, setId] = useState(initialTeam?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderIds, setLeaderIds] = useState<string[]>(initialTeam?.leaderIds || []);

  useEffect(() => {
    if (isOpen) {
      fetchLeaders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTeam) {
      setName(initialTeam.name);
      setId(initialTeam.id);
      setLeaderIds(initialTeam.leaderIds || []);
    }
  }, [initialTeam]);

  async function fetchLeaders() {
    try {
      const leadersFromDb = await listLeaders();
      setLeaders(leadersFromDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar líderes");
      }
    }
  }

  const resetModal = () => {
    setId("");
    setName("");
    setLeaderIds([]);
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
        await updateTeam({ id, name, leaderIds });
        toast.success("Equipe atualizada com sucesso!");
      } else {
        await createTeam({ name, leaderIds });
        toast.success("Equipe criada com sucesso!");
      }

      updateTeams();
      closeAndResetModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao salvar equipe");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setLeaderIds(prevLeaderIds => 
      checked 
        ? [...prevLeaderIds, value] 
        : prevLeaderIds.filter(id => id !== value)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl mb-4 text-purple-950 dark:text-purple-300 font-bold uppercase">
          {id ? `Editar equipe - ${name}` : "Cadastrar Nova Equipe"}
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
            <label className="block text-lime-950 dark:text-lime-300">Líderes</label>
            <div className="flex flex-wrap">
              {leaders.map(leader => (
                <div key={leader.id} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    value={leader.id}
                    checked={leaderIds.includes(leader.id)}
                    onChange={handleLeaderChange}
                    className="form-checkbox h-5 w-5 text-lime-600 dark:text-lime-300 dark:bg-gray-800 border-gray-300 rounded focus:ring-lime-500 dark:focus:ring-lime-300"
                  />
                  <label className="ml-2 text-lime-900 dark:text-lime-300">{leader.name}</label>
                </div>
              ))}
            </div>
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
