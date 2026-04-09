import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Brain, MapPin, Calendar, AlertTriangle, Truck, BookOpen, Zap, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const searchIndex = [
  { label: "AI Waste Classifier", keywords: "ai classify waste type photo upload ml", path: "/", icon: Brain },
  { label: "Facility Locator", keywords: "map facilities recycling center location search", path: "/facilities", icon: MapPin },
  { label: "Collection Schedule", keywords: "calendar schedule collection zone ward pickup day", path: "/schedule", icon: Calendar },
  { label: "Report Illegal Dumping", keywords: "report dump illegal gps photo location", path: "/report", icon: AlertTriangle },
  { label: "Bulky Item Pickup", keywords: "bulky large furniture appliance pickup schedule", path: "/bulky-pickup", icon: Truck },
  { label: "Knowledge Base", keywords: "guide bin recycling pdf reference sorting", path: "/guides", icon: BookOpen },
  { label: "E-Waste Disposal Guide", keywords: "ewaste electronic battery hazardous disposal", path: "/ewaste", icon: Zap },
  { label: "Waste Tracker", keywords: "tracker chart analytics recycled waste weekly", path: "/tracker", icon: BarChart3 },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter(item =>
      item.label.toLowerCase().includes(q) || item.keywords.includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search pages, features..."
        className="pl-9 h-9 bg-muted/50 border-border/50 focus:bg-background"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map(r => (
            <button
              key={r.path}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-accent text-left transition-colors"
              onClick={() => { navigate(r.path); setQuery(""); setOpen(false); }}
            >
              <r.icon className="h-4 w-4 text-primary shrink-0" />
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
