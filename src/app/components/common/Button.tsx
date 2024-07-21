import React from "react";

interface ButtonProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  type: "CANCEL" | "CONFIRM" | "WARNING" | "INFO";
  specialClass?: string;
}

export const ButtonType =  {
  CANCEL : "bg-red-600 text-white font-bold rounded-lg px-4 py-2",
  CONFIRM : "bg-gradient-to-tr from-purple-700 to-purple-950 hover:from-purple-500 hover:to-purple-750 text-white font-bold rounded-lg px-4 py-2",
  WARNING : "bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg px-4 py-2",
  INFO: "bg-gray-100 hover:bg-gray-200 text-black font-normal rounded-lg px-4 py-2"
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type, specialClass = "" }) => {
  return (
    <button
      className={`${ButtonType[type]} ${specialClass}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
