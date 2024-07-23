import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flecha - Sistema de Gestão de Pessoas, Equipes e Metas",
  description: "O Flecha é um sistema avançado para a gestão de pessoas, equipes e metas, facilitando o gerenciamento e a organização de suas operações.",
  keywords: ["Flecha", "gestão de pessoas", "gestão de equipes", "gestão de metas", "gerenciamento de equipes"],
  authors: [
    { name: "Rodtech", url: "https://paulorodriguesdev.com.br/" },
    { name: "Paulo Rodrigues", url: "https://paulorodriguesdev.com.br/" },
    { name: "paulorodriguesdev", url: "https://www.linkedin.com/in/paulorodriguesdevcode/" }
  ],
  robots: "index, follow"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
          <ToastContainer />
      </body>
    </html>
  );
}
