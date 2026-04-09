import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Trash2, Recycle, Leaf, AlertCircle, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const zones: Record<string, { general: number[]; recyclable: number[]; green: number[] }> = {
  "zone-a": { general: [1], recyclable: [3], green: [5] },
  "zone-b": { general: [2], recyclable: [4], green: [6] },
  "zone-c": { general: [1, 4], recyclable: [2, 5], green: [6] },
  "zone-d": { general: [3], recyclable: [5], green: [1] },
};

const holidays = [
  { month: 0, day: 26 }, // Republic Day
  { month: 7, day: 15 }, // Independence Day
  { month: 9, day: 2 }, // Gandhi Jayanti
];

const wasteTypes = [
  { type: "General", color: "bg-foreground/80 text-background", icon: Trash2 },
  { type: "Recyclable", color: "bg-primary text-primary-foreground", icon: Recycle },
  { type: "Green Waste", color: "bg-success text-success-foreground", icon: Leaf },
];

interface ScheduleEvent {
  date: Date;
  type: string;
  shifted?: boolean;
  shiftReason?: string;
}

export default function CollectionSchedule() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [zone, setZone] = useState("zone-a");
  const [filterType, setFilterType] = useState("all");
  const [holidayDelay, setHolidayDelay] = useState(true);

  const events = useMemo(() => {
    const config = zones[zone];
    if (!config) return [];
    const result: ScheduleEvent[] = [];
    const now = new Date();
    const year = now.getFullYear();

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, m, d);
        const dow = date.getDay(); // 0=Sun

        const isHoliday = holidayDelay && holidays.some(h => h.month === m && h.day === d);

        const addEvent = (type: string) => {
          if (isHoliday) {
            const shifted = new Date(year, m, d + 1);
            result.push({ date: shifted, type, shifted: true, shiftReason: "Holiday adjustment" });
          } else {
            result.push({ date, type });
          }
        };

        if (config.general.includes(dow)) addEvent("General");
        if (config.recyclable.includes(dow)) addEvent("Recyclable");
        if (config.green.includes(dow)) addEvent("Green Waste");
      }
    }
    return result;
  }, [zone, holidayDelay]);

  const filtered = filterType === "all" ? events : events.filter(e => e.type === filterType);

  const selectedEvents = selected
    ? filtered.filter(e => e.date.toDateString() === selected.toDateString())
    : [];

  const eventDates = filtered.map(e => e.date);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Collection Schedule
        </h1>
        <p className="text-sm text-muted-foreground">Dynamic calendar driven by zone selection with holiday adjustments.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Zone</Label>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zone-a">Zone A</SelectItem>
              <SelectItem value="zone-b">Zone B</SelectItem>
              <SelectItem value="zone-c">Zone C</SelectItem>
              <SelectItem value="zone-d">Zone D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Recyclable">Recyclable</SelectItem>
              <SelectItem value="Green Waste">Green Waste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Switch id="holiday" checked={holidayDelay} onCheckedChange={setHolidayDelay} />
          <Label htmlFor="holiday" className="text-xs cursor-pointer">Holiday Delay</Label>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2">
        {wasteTypes.map(w => (
          <Badge key={w.type} className={w.color}><w.icon className="h-3 w-3 mr-1" />{w.type}</Badge>
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
              <CardTitle className="text-sm">
                {selected
                  ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a date"}
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
                        <AlertCircle className="h-3 w-3 mr-1" /> Shifted
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {holidayDelay && (
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Holiday Delay Active</p>
                  <p className="text-xs text-muted-foreground">Collections falling on national holidays are automatically shifted to the next day.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
