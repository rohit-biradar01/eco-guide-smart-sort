import {
  Brain, Calendar, MapPin, Truck, AlertTriangle, BookOpen, Zap, BarChart3, Leaf, Recycle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "AI Classifier", url: "/", icon: Brain },
  { title: "Collection Schedule", url: "/schedule", icon: Calendar },
  { title: "Facility Locator", url: "/facilities", icon: MapPin },
  { title: "Bulky Pickup", url: "/bulky-pickup", icon: Truck },
  { title: "Report Dumping", url: "/report", icon: AlertTriangle },
  { title: "Bin Guide", url: "/guides", icon: BookOpen },
  { title: "E-Waste Disposal", url: "/ewaste", icon: Zap },
  { title: "Waste Tracker", url: "/tracker", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Recycle className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">EcoSort</span>
              <span className="text-xs text-sidebar-foreground/60">Smart Waste Manager</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
            <Leaf className="h-3 w-3" />
            <span>Built for a greener planet</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
