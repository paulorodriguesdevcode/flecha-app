"use client"
import { useRouter } from "next/navigation";
import Button from "./components/common/Button";

export default function PageNotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/customers");
  };

  return (
    <div className="font-sans ">
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-purple-200 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6" />
          <div className="card bg-purple-900 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6" />
          <div className="relative w-full rounded-3xl px-6 py-4 bg-purple-50 shadow-md">
            <label className="block mt-3 text-sm text-gray-700 text-center font-semibold">
              Página Não Encontrada
            </label>
            <div className="mt-10 text-center">
              <p className="text-gray-700">
                A página que você está procurando não existe.
              </p>
            </div>
            <div className="mt-7">
              <Button text="Voltar para a Página Inicial" onClick={handleGoHome} type="CONFIRM" specialClass="bg-purple-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
