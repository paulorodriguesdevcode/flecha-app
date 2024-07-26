"use client"

import { Users, Goal, Shield } from "lucide-react";
import Card from "../components/common/Card";
import { useEffect, useState } from "react";
import { getTotalLeaders } from "../api/LeadersService";
import { getTotalGoals } from "../api/GoalsService";
import BarChart from "../components/common/charts/BarChart";

export default function Page() {

  const [totalTeams, setTotalTeams] = useState<number>(0)
  const [totalLeaders, setTotalLeaders] = useState<number>(0)
  const [totalGoals, setTotalGoals] = useState<number>(0)

  useEffect(() => {
    const fetchTotalTeams = async () => {
      try {
        const total = await getTotalLeaders();
        setTotalTeams(total);
      } catch (error) {
        console.error('Failed to fetch total teams:', error);
      }
    };

    fetchTotalTeams();
  }, []);

  useEffect(() => {
    const fetchTotalLeaders = async () => {
      try {
        const total = await getTotalLeaders();
        setTotalLeaders(total);
      } catch (error) {
        console.error('Failed to fetch total leaders:', error);
      }
    };

    fetchTotalLeaders();
  }, []);

  useEffect(() => {
    const fetchTotalGoals = async () => {
      try {
        const total = await getTotalGoals();
        setTotalGoals(total);
      } catch (error) {
        console.error('Failed to fetch total goals:', error);
      }
    };

    fetchTotalGoals();
  }, []);

  const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
    datasets: [
      {
        label: 'Parceiro de Deus',
        backgroundColor: '#6d28d9',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: [65, 59, 80, 81],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução Parceiro de Deus',
      },
    },
  };

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={false} title="Total de equipes" value={totalTeams.toString()} icon={Shield} />
            <Card isLoading={false} title="Total de lideres" value={totalLeaders.toString()} icon={Users} />
            <Card isLoading={false} title="Total de lideres" value={totalLeaders.toString()} icon={Users} />
            <Card isLoading={false} title="Total de metas" value={totalGoals.toString()} icon={Goal} />
          </div>
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <BarChart data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
} 
