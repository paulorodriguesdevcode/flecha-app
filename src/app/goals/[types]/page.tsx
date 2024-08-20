"use client";

import { useEffect, useState } from "react";
import TypeTable from "@/app/components/goals/TypesTable"; 
import Card from "../../components/common/Card";
import { listTypes } from "../../api/TypesService"; 
import { toast } from "react-toastify";
import { GoalType } from "../../types/goal"; 
import TypeModal from "../../components/goals/TypeModal"; 
import Button from "../../components/common/Button";
import { Tag } from "lucide-react"; 
import { exportTypesToExcel } from "../../services/export-types-excel"; 

export default function Page() {
  const [modalTypeOpen, setModalTypeOpen] = useState(false);
  const [types, setTypes] = useState<GoalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const openModalType = () => setModalTypeOpen(true);
  const closeModalType = () => setModalTypeOpen(false);

  async function fetchTypes() {
    try {
      const typesFromDb = await listTypes();
      setTypes(typesFromDb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar tipos");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de tipos" value={types?.length?.toString()} icon={Tag} />
          </div>

          <div className="flex-wrap">
            <div className="flex">
              <Button text="Cadastrar Novo Tipo" type={"CONFIRM"} onClick={openModalType} />
              <Button text="Exportar em excel" type={"CONFIRM"} onClick={() => exportTypesToExcel(types)} specialClass="ml-4" />
            </div>

            <TypeTable types={types} isLoading={isLoading} updateTypes={() => fetchTypes()} />
          </div>
        </div>
      </div>

      <TypeModal isOpen={modalTypeOpen} onClose={closeModalType} updateTypes={() => fetchTypes()} />
    </div>
  );
}
