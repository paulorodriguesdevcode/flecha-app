"use client"

import { useEffect, useState } from "react";
import CustomersTable from "@/app/components/customers/CustomersTable";
import Card from "../components/common/Card";
import { listCustomers } from "../api/CustomersService";
import { exportCustomersToExcel } from "../services/export-customers-excel";
import { toast } from "react-toastify";
import { Customer } from "../types/customer";
import CustomerModal from "../components/customers/CustomerModal";
import Button from "../components/common/Button";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setModalOpen(true);
  const closeModal = () => { setModalOpen(false) };

  async function fetchCustomers() {
    try {
      const customersFromDb = await listCustomers();
      setCustomers(customersFromDb);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar clientes");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Total de clientes" value={customers?.length?.toString()} />
          </div>

          <div className='flex-wrap'>
            <div className='flex'>
              <Button text='Cadastrar Novo Cliente' type={"CONFIRM"} onClick={openModal} />
              <Button text='Exportar em excel' type={"CONFIRM"} onClick={() => exportCustomersToExcel(customers)} specialClass="ml-6" />
            </div>

            <CustomersTable customers={customers} isLoading={isLoading} updateCustomers={() => fetchCustomers()} />
          </div>
        </div>
      </div>
      <CustomerModal isOpen={modalOpen} onClose={closeModal} updateCustomers={() => fetchCustomers()} />

    </div>
  );
} 
