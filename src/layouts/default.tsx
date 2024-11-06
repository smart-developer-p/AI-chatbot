import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.screen.width >= 768
  );

  return (
    <div className="flex gap-0 h-[100dvh] relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="relative flex-1 overflow-hidden">
        <Header toggleSideBar={() => setIsSidebarOpen((prev) => !prev)} isOpen={isSidebarOpen} />
        <main className="overflow-hidden h-full">{children}</main>
      </div>
    </div>
  );
}
