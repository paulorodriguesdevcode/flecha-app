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
  const [leader, setLeader] = useState<Team | undefined>(initialTeam);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderIds, setLeaderId] = useState<string[]>([]);

  async function fetchLeaders() {
    try {
      const leaderFromDb = await listLeaders();
      setLeaders(leaderFromDb);
      if (leaderFromDb.length > 0) {
        setLeaderId([leaderFromDb[0].id, ...leaderIds]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar lideres");
      }
    }
  }

  useEffect(() => {
    if (initialTeam) {
      setLeader(initialTeam);
    } else {
      setLeader(undefined);
    }
  }, [initialTeam]);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const resetModal = () => {
    setId("");
    setName("");
    setLeader(undefined);
  };

  const closeAndResetModal = () => { resetModal(); onClose() }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (leader) {
        await updateTeam({ id, name, leaderIds });
        toast.success("Lider atualizado com sucesso!");
      } else {
        await createTeam({name,leaderIds});
        toast.success("Lider criado com sucesso!");
      }

      updateTeams();
      resetModal();
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-purple-950 font-bold uppercase">
          {leader ? `Editar lider - ${leader?.name?.split(" ")[0]}` : "Cadastrar Nova Equipe"}
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
            <label className="block text-lime-950">Lider</label>
            <select
              value={leaderIds}
              onChange={(e) => setLeaderId([e.target.value])}
              className="w-full px-4 py-2 border rounded-lg focus:outline-lime-700"
              required
            >
              <option value="" disabled>Selecione um lider</option>
              {leaders.map(leader => (
                <option value={leader.id} key={leader.id}>
                  {leader.name}
                </option>
              ))}
            </select>
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
                leader ? "Salvar" : "Cadastrar"
              )}
            </button>
            <Button text="Cancelar" onClick={closeAndResetModal} type="INFO" specialClass=""/>
          </div>
        </form>
      </div>
    </div>
  );
} 
