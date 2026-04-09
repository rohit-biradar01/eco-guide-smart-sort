import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Recycle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-30">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center gap-2 md:hidden">
              <Recycle className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm">EcoSort</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
