import { useState } from "react";
import { Calendar as CalendarIcon, Trash2, Recycle, Leaf, AlertCircle, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const wasteTypes = [
  { type: "General", color: "bg-foreground/80 text-background", icon: Trash2 },
  { type: "Recyclable", color: "bg-primary text-primary-foreground", icon: Recycle },
  { type: "Green Waste", color: "bg-success text-success-foreground", icon: Leaf },
];

interface ScheduleEvent {
  date: Date;
  type: string;
  holiday?: string;
  shifted?: boolean;
}

function generateEvents(): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  for (let d = 1; d <= 28; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    if (dow === 1) events.push({ date, type: "General" });
    if (dow === 3) events.push({ date, type: "Recyclable" });
    if (dow === 5) events.push({ date, type: "Green Waste" });
  }

  // Holiday adjustment example
  const holiday = new Date(year, month, 15);
  events.push({ date: new Date(year, month, 16), type: "General", holiday: "Independence Day", shifted: true });

  return events;
}

const events = generateEvents();

export default function CollectionSchedule() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = filterType === "all" ? events : events.filter(e => e.type === filterType);
  const selectedEvents = selected ? filtered.filter(e =>
    e.date.toDateString() === selected.toDateString()
  ) : [];

  const eventDates = filtered.map(e => e.date);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-7 w-7 text-primary" />
          Collection Schedule
        </h1>
        <p className="text-muted-foreground">Your personalised waste collection calendar with holiday adjustments.</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="General">General Waste</SelectItem>
            <SelectItem value="Recyclable">Recyclable</SelectItem>
            <SelectItem value="Green Waste">Green Waste</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 ml-auto">
          {wasteTypes.map(w => (
            <Badge key={w.type} className={w.color}><w.icon className="h-3 w-3 mr-1" />{w.type}</Badge>
          ))}
        </div>
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
              <CardTitle className="text-sm">
                {selected ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collections scheduled</p>
              ) : selectedEvents.map((ev, i) => {
                const wt = wasteTypes.find(w => w.type === ev.type)!;
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Badge className={wt.color}><wt.icon className="h-3 w-3 mr-1" />{ev.type}</Badge>
                    {ev.shifted && (
                      <Badge variant="outline" className="border-warning text-warning text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" /> Holiday Shift
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Holiday alert */}
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Holiday Adjustment</p>
                <p className="text-xs text-muted-foreground">Collections on the 15th are shifted to the 16th due to Independence Day.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
