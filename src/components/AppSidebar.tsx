import {
  Brain, Calendar, MapPin, Truck, AlertTriangle, BookOpen, Zap, BarChart3, Recycle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "AI Classifier", url: "/", icon: Brain },
  { title: "Facility Locator", url: "/facilities", icon: MapPin },
  { title: "Collection Schedule", url: "/schedule", icon: Calendar },
  { title: "Report Dumping", url: "/report", icon: AlertTriangle },
  { title: "Bulky Pickup", url: "/bulky-pickup", icon: Truck },
  { title: "Knowledge Base", url: "/guides", icon: BookOpen },
  { title: "E-Waste Guide", url: "/ewaste", icon: Zap },
  { title: "Waste Tracker", url: "/tracker", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Recycle className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground tracking-tight">EcoClean</span>
              <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">Waste Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/40 text-center">v1.0 — Hackathon Demo</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
