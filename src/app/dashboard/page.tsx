"use client"

import { Users, Goal, Shield } from "lucide-react";
import Card from "../components/common/Card";
import { useEffect, useState } from "react";
import { getTotalLeaders } from "../api/LeadersService";

export default function Page() {

  const [totalTeams, setTotalTeams] = useState<number>(0)
  const [totalLeaders, setTotalLeaders] = useState<number>(0)
  // const [totalGoals,setTotalGoals] = useState<number>(0)

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

  return (
    <div>
      <div className="p-4 xl:ml-80 ">
        <div className="mt-20">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <Card isLoading={false} title="Total de equipes" value={totalTeams.toString()} icon={Shield} />
            <Card isLoading={false} title="Total de lideres" value={totalLeaders.toString()} icon={Users} />
            <Card isLoading={false} title="Total de metas" value={"0".toString()} icon={Goal} />
          </div>
        </div>
      </div>
    </div>
  );
} 
