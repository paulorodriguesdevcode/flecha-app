import { useState, useEffect } from "react";
import { createGoal, updateGoal } from "@/app/api/GoalsService";
import { Goal } from "@/app/types/goal";
import { toast } from "react-toastify";
import Button from "../common/Button";
import { listTeams } from "@/app/api/TeamsService";
import { Team } from "@/app/types/team";
import { Leader } from "@/app/types/leader";
import { listLeaders } from "@/app/api/LeadersService";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateGoals: () => void;
  initialGoal?: Goal;
}

export default function GoalModal({ isOpen, onClose, updateGoals, initialGoal }: GoalModalProps) {
  const [title, setTitle] = useState(initialGoal?.title || "");
  const [description, setDescription] = useState<string | undefined>(initialGoal?.description || "");
  const [dueDate, setDueDate] = useState(initialGoal?.dueDate || "");
  const [expectedGoal, setExpectedGoal] = useState<number>(initialGoal?.expectedGoal || 0);
  
  const [target, setTarget] = useState<"leader" | "team" | undefined | string>(initialGoal?.target || "");
  const [referenceIds, setReferenceIds] = useState(initialGoal?.referenceIds || []);
  const [id, setId] = useState(initialGoal?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
      fetchLeaders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setDueDate(initialGoal.dueDate);
      setTarget(initialGoal.target);
      setReferenceIds(initialGoal.referenceIds || []);
      setId(initialGoal.id);
    }
  }, [initialGoal]);

  async function fetchTeams() {
    try {
      const teamsFromDb = await listTeams();
      setTeams(teamsFromDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar equipes");
      }
    }
  }

  async function fetchLeaders() {
    try {
      const leadersFromDb = await listLeaders();
      setLeaders(leadersFromDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar lideres");
      }
    }
  }

  const resetModal = () => {
    setId("");
    setTitle("");
    setDescription("");
    setDueDate("");
    setTarget(undefined);
    setReferenceIds([]);
    setExpectedGoal(0)
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
        await updateGoal({ id, title, description, dueDate, target, referenceIds });
        toast.success("Meta atualizada com sucesso!");
      } else {
        await createGoal({ title, description, dueDate, target, referenceIds, expectedGoal });
        toast.success("Meta criada com sucesso!");
      }

      updateGoals();
      closeAndResetModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao salvar meta");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setReferenceIds(prevTeamIds =>
      checked
        ? [...prevTeamIds, value]
        : prevTeamIds.filter(id => id !== value)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-950 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl mb-4 text-purple-950 dark:text-purple-300 font-bold uppercase">
          {id ? `Editar Meta - ${title}` : "Cadastrar Nova Meta"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Título</label>
            <input
              type="text"
              value={title}
              maxLength={20}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Meta</label>
            <input
              type="number"
              value={expectedGoal}
              onChange={(e) => setExpectedGoal(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Data de Vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-950 dark:text-purple-300">Alvo</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-purple-700 text-purple-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700"
              required
            >
              <option value="" >Selecione o alvo</option>
              <option value="leader">Líder</option>
              <option value="team">Equipe</option>
            </select>
          </div>


          <div className="mb-4">
            <label className="block text-lime-950 dark:text-lime-300">Referências</label>
            <div className="flex flex-wrap">

              {target === 'leader' && (leaders.map(leader => (
                <div key={leader.id} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    value={leader.id}
                    onChange={handleTeamChange}
                    className="form-checkbox h-5 w-5 text-lime-600 dark:text-lime-300 dark:bg-gray-800 border-gray-300 rounded focus:ring-lime-500 dark:focus:ring-lime-300"
                  />
                  <label className="ml-2 text-lime-900 dark:text-lime-300">{leader.name}</label>
                </div>
              )))}

              {target === 'team' && (teams.map(team => (
                <div key={team.id} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    value={team.id}
                    onChange={handleTeamChange}
                    className="form-checkbox h-5 w-5 text-lime-600 dark:text-lime-300 dark:bg-gray-800 border-gray-300 rounded focus:ring-lime-500 dark:focus:ring-lime-300"
                  />
                  <label className="ml-2 text-lime-900 dark:text-lime-300">{team.name}</label>
                </div>
              )))}

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
