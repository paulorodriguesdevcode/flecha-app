import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { LucideProps } from 'lucide-react'
interface CardProps {
  title: string;
  value: string | JSX.Element;
  isLoading?: boolean;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

const Card: React.FC<CardProps> = ({ title, value, isLoading, icon:Icon }) => {
  return (
    <div className=" flex flex-col rounded-2xl  bg-purple-900 text-white">
      <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-950 to-purple-700 text-white  shadow-purple-500/40 shadow-lg -mt-4 grid h-16 w-16 place-items-center">
      <Icon />
      </div> 
      <div className="p-4 text-right">
        <p className="block">{title}</p>
        <h4 title="Carregando" className=" block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 float-right">
          {isLoading ?
            <ThreeDots
              height="80"
              width="20"
              radius="9"
              color="black"
              ariaLabel="three-dots-loading"
              visible={true}
            />
            : value}
        </h4>
      </div>
    </div>
  );
};

export default Card;
