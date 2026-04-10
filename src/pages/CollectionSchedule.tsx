import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Trash2, Recycle, Leaf, Filter, Truck, AlertTriangle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendar, type CalendarEvent } from "@/contexts/CalendarContext";

const defaultSchedule: { general: number[]; recyclable: number[]; green: number[] } = {
  general: [1, 4],
  recyclable: [2, 5],
  green: [3, 6],
};

const wasteTypeConfig = {
  "General": { color: "bg-eco-blue text-eco-blue-foreground", icon: Trash2, dot: "bg-eco-blue" },
  "Recyclable": { color: "bg-eco-yellow text-eco-yellow-foreground", icon: Recycle, dot: "bg-eco-yellow" },
  "Green Waste": { color: "bg-eco-green text-eco-green-foreground", icon: Leaf, dot: "bg-eco-green" },
  "Bulky Pickup": { color: "bg-purple text-purple-foreground", icon: Truck, dot: "bg-purple" },
  "Dumping Report": { color: "bg-eco-red text-eco-red-foreground", icon: AlertTriangle, dot: "bg-eco-red" },
};

export default function CollectionSchedule() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState("all");
  const { customEvents } = useCalendar();

  const zoneEvents = useMemo(() => {
    const result: CalendarEvent[] = [];
    const year = new Date().getFullYear();

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, m, d);
        const dow = date.getDay();

        if (defaultSchedule.general.includes(dow))
          result.push({ id: `gen-${m}-${d}`, date, type: "General", label: "General Waste" });
        if (defaultSchedule.recyclable.includes(dow))
          result.push({ id: `rec-${m}-${d}`, date, type: "Recyclable", label: "Recyclable" });
        if (defaultSchedule.green.includes(dow))
          result.push({ id: `grn-${m}-${d}`, date, type: "Green Waste", label: "Green Waste" });
      }
    }
    return result;
  }, []);

  const allEvents = [...zoneEvents, ...customEvents];
  const filtered = filterType === "all" ? allEvents : allEvents.filter(e => e.type === filterType);

  const selectedEvents = selected
    ? filtered.filter(e => e.date.toDateString() === selected.toDateString())
    : [];

  const eventDates = filtered.map(e => e.date);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-eco-blue" />
          Collection Schedule
        </h1>
        <p className="text-sm text-muted-foreground">Your weekly collection calendar with color-coded waste types.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[170px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Recyclable">Recyclable</SelectItem>
              <SelectItem value="Green Waste">Green Waste</SelectItem>
              <SelectItem value="Bulky Pickup">Bulky Pickup</SelectItem>
              <SelectItem value="Dumping Report">Dumping Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(wasteTypeConfig) as [string, typeof wasteTypeConfig["General"]][]).map(([type, cfg]) => (
          <Badge key={type} className={cfg.color}>
            <cfg.icon className="h-3 w-3 mr-1" />{type}
          </Badge>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              className="pointer-events-auto w-full"
              modifiers={{ event: eventDates }}
              modifiersClassNames={{ event: "bg-primary/20 font-bold text-primary rounded-md" }}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">
                {selected
                  ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collections scheduled</p>
              ) : selectedEvents.map((ev, i) => {
                const cfg = wasteTypeConfig[ev.type];
                return (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                    <Badge className={cfg.color}><cfg.icon className="h-3 w-3 mr-1" />{ev.type}</Badge>
                    {ev.label !== ev.type && <span className="text-xs text-muted-foreground truncate">{ev.label}</span>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {customEvents.filter(e => e.type === "Bulky Pickup").length > 0 && (
            <Card className="border-purple/30 bg-purple/5">
              <CardContent className="p-4 flex gap-3">
                <Truck className="h-5 w-5 text-purple shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium font-heading">Bulky Pickups</p>
                  <p className="text-xs text-muted-foreground">{customEvents.filter(e => e.type === "Bulky Pickup").length} pickup(s) scheduled</p>
                </div>
              </CardContent>
            </Card>
          )}

          {customEvents.filter(e => e.type === "Dumping Report").length > 0 && (
            <Card className="border-eco-red/30 bg-eco-red/5">
              <CardContent className="p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-eco-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium font-heading">Dumping Reports</p>
                  <p className="text-xs text-muted-foreground">{customEvents.filter(e => e.type === "Dumping Report").length} report(s) filed</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
