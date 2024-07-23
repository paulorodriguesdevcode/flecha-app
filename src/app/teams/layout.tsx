import "../../app/globals.css";
import Navbar from "../components/common/Navbar";

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-wrap ">
      <Navbar />
      <main className="min-h-screen bg-purple-50 dark:bg-black">
        {children}
      </main>
    </div> 
  );
}
 