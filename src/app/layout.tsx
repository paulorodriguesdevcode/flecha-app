import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OSPRO - Sistema de Gestão de Clientes e Envio de Ordens de Serviço",
  description: "OSPRO: Gerenciamento eficiente de clientes e envio de ordens de serviço por email. Melhore a organização e comunicação do seu negócio com OSPRO.",
  keywords: ["OSPRO", "gestão de clientes", "envio de ordens de serviço", "sistema de ordens de serviço", "gerenciamento de clientes"],
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
