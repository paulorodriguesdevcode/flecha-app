"use client"

import { useEffect, useState } from "react";
import TeamsTable from "@/app/components/teams/TeamsTable";
import Card from "../components/common/Card";
import { listTeams } from "../api/TeamsService";
import { exportTeamsToExcel } from "../services/export-teams-excel";
import { toast } from "react-toastify";
import { Team } from "../types/team";
import TeamModal from "../components/teams/TeamModal";
import Button from "../components/common/Button";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setModalOpen(true);
  const closeModal = () => { setModalOpen(false) };

  async function fetchTeams() {
    try {
      const teamsFromDb = await listTeams();
      console.log(teamsFromDb)
      setTeams(teamsFromDb);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar equipes");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de equipes" value={teams?.length?.toString()} />
          </div>

          <div className='flex-wrap'>
            <div className='flex'>
              <Button text='Cadastrar Nova equipe' type={"CONFIRM"} onClick={openModal} />
              <Button text='Exportar em excel' type={"CONFIRM"} onClick={() => exportTeamsToExcel(teams)} specialClass="ml-6" />
            </div>

            <TeamsTable teams={teams} isLoading={isLoading} updateTeams={() => fetchTeams()} />
          </div>
        </div>
      </div>
      <TeamModal isOpen={modalOpen} onClose={closeModal} updateTeams={() => fetchTeams()} />

    </div>
  );
} 
