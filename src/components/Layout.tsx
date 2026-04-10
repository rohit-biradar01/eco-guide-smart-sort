import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Recycle, User, LogOut } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card/80 backdrop-blur-sm px-4 sticky top-0 z-30 gap-3">
            <SidebarTrigger className="mr-1 hidden md:flex" />
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
                <Recycle className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm font-heading gradient-text">EcoClean</span>
            </div>
            <div className="flex-1 flex justify-center md:justify-start">
              <GlobalSearch />
            </div>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold font-heading">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium font-heading">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
            )}
          </header>
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
