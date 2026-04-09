import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Recycle, User } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card/80 backdrop-blur-sm px-4 sticky top-0 z-30 gap-3">
            <SidebarTrigger className="mr-1 hidden md:flex" />
            <div className="flex items-center gap-2 md:hidden">
              <Recycle className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm">EcoClean</span>
            </div>
            <div className="flex-1 flex justify-center md:justify-start">
              <GlobalSearch />
            </div>
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </header>
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          {/* Mobile bottom tabs */}
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
