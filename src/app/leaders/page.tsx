"use client"

import { useEffect, useState } from "react";
import LeadersTable from "@/app/components/leaders/LeadersTable";
import Card from "../components/common/Card";
import { listLeaders } from "../api/LeadersService";
import { exportLeadersToExcel } from "../services/export-leaders-excel";
import { toast } from "react-toastify";
import { Leader } from "../types/leader";
import LeaderModal from "../components/leaders/LeaderModal";
import Button from "../components/common/Button";
import { Users } from "lucide-react";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setModalOpen(true);
  const closeModal = () => { setModalOpen(false) };

  async function fetchLeaders() {
    try {
      const leaderFromDb = await listLeaders();
      setLeaders(leaderFromDb);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar lideres");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de lideres" value={leaders?.length?.toString()} icon={Users} />
          </div>

          <div className='flex-wrap'>
            <div className='flex'>
              <Button text='Cadastrar Novo Lider' type={"CONFIRM"} onClick={openModal} />
              <Button text='Exportar em excel' type={"CONFIRM"} onClick={() => exportLeadersToExcel(leaders)} specialClass="ml-6" />
            </div>

            <LeadersTable leaders={leaders} isLoading={isLoading} updateLeaders={() => fetchLeaders()} />
          </div>
        </div>
      </div>
      <LeaderModal isOpen={modalOpen} onClose={closeModal} updateLeaders={() => fetchLeaders()} />

    </div>
  ); 
} 
