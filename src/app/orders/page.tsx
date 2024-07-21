"use client"

import { useCallback, useEffect, useState } from "react";
import OrdersTable from "@/app/components/orders/OrdersTable";
import Card from "../components/common/Card";
import { listOrders } from "../api/OrdersService";
import { exportOrdersToExcel } from "../services/export-orders-excel";
import { toast } from "react-toastify";
import OrderModal from "../components/orders/OrdersModal";
import Button from "../components/common/Button";
import { Order } from "../types/order";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setModalOpen(true);
  const closeModal = () => { setModalOpen(false) };

  const fetchOrders = useCallback(async () => {
    try {
      const ordersFromDb = await listOrders();
      setOrders(ordersFromDb);
      const totalPrice = ordersFromDb.reduce((acc: any, order: Order) => acc + parseFloat(order.price.toString()), 0);
      setTotalPrice(totalPrice)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao tentar listar ordens");
      }
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div> 
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={isLoading} title="Quantidade de ordens" value={orders?.length?.toString()} />
            <Card isLoading={isLoading} title="Faturamento total" value={"R$ " + totalPrice?.toFixed(2).toString()} />
          </div>

          <div className='flex-wrap'>
            <div className='flex'>
              <Button text='Cadastrar Nova Ordem' type={"CONFIRM"} onClick={openModal} />
              <Button text='Exportar em excel' type={"CONFIRM"} onClick={() => exportOrdersToExcel(orders)} specialClass="ml-6" />
            </div>

            <OrdersTable orders={orders} isLoading={isLoading} updateOrders={() => fetchOrders()} />
          </div>
        </div>
      </div>
      <OrderModal isOpen={modalOpen} onClose={closeModal} updateOrders={() => fetchOrders()} />
    </div>
  );
} 
