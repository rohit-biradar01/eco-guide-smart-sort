import { Brain, MapPin, Calendar, AlertTriangle, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const tabs = [
  { icon: Brain, label: "Classify", path: "/dashboard" },
  { icon: MapPin, label: "Locate", path: "/facilities" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: AlertTriangle, label: "Report", path: "/report" },
  { icon: BarChart3, label: "Track", path: "/tracker" },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-40 px-1">
      {tabs.map(t => (
        <NavLink
          key={t.path}
          to={t.path}
          end
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <t.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
