"use client"

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { openConfirmationAlert } from "./ConfirmationAlert";
import { logoff } from "./Logoff";
import { ArrowRight, DoorOpenIcon, Euro, HouseIcon, ListIcon, Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event:any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleResize()
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside);

    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className={`bg-purple-950 fixed ${isSidebarOpen ? "" : "-translate-x-0"} `}>
        <div className='flex justify-between p-2.5 w-[calc(100vw)]'>
          <button
            className="top-4 left-4 z-50  bg-purple-950 p-2 rounded text-white"
            onClick={toggleSidebar}
          >
            <Menu/>
          </button>
          <div className="middle none font-sans font-bold center transition-all text-white">
            <button onClick={() => openConfirmationAlert({
              title: "Confirmação de saida",
              question: "Você tem certeza de que deseja sair da aplicação?",
              confirmMethod: logoff,
              classButtonCancel: "CONFIRM",
              classButtonConfirm: "CANCEL"

            })} className="py-3 rounded-lg hover:shadow-lg hover:shadow-purple-900/40 middle none font-sans font-bold center transition-all text-white active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize" type="button">
              <DoorOpenIcon/>
            </button>
          </div>
        </div>

      </div>
      <aside ref={sidebarRef} className={`bg-purple-950 fixed  z-50 ml-4 h-[calc(100vh)] w-72 rounded-xl transition-transform duration-300 ${isSidebarOpen ? "-translate-x-5 -translate-y-1 " : "-translate-x-80"} `}>
        <div className="relative  flex justify-between">
          <button
            className="flex items-center gap-4 py-6 px-8 text-white"
            onClick={toggleSidebar}
          >
            <Menu/>
          </button>
          <a className="flex items-center gap-4 py-6 px-8" href="#/">
            <h6 className="flex antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
              Fl{<Euro size={20} />}xa</h6>
          </a>
        </div>
        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-1 text-white">
            <Link href='/customers' className={`${pathname === "/customers" ? ("shadow-md bg-gradient-to-tr") : ("")} middle none font-sans font-bold center transition-all`}>
              <li>
                <button className="py-3 rounded-lg hover:shadow-lg hover:shadow-purple-900/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize" type="button">
                  <HouseIcon/>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Clientes</p>
                </button>
              </li>
            </Link>
            <Link href='/orders' className={`${pathname === "/orders" ? ("shadow-md bg-gradient-to-tr") : ("")} middle none font-sans font-bold center transition-all`}>
              <li>
                <button className="py-3 rounded-lg hover:shadow-lg hover:shadow-purple-900/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize" type="button">
                  <ListIcon/>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">ordens de serviço</p>
                </button>
              </li>
            </Link>

          </ul>
        </div>
      </aside>
    </div>
  )
}

export default Navbar;