import { useState, useCallback, useMemo } from "react";
import { BarChart3, TrendingUp, Trophy, Flame, Leaf, Target, Plus, Loader2, Crown, Shield, Award, Star, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

interface WasteEntry {
  day: string;
  generated: number;
  recycled: number;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const leagues = [
  { name: "Bronze", minPoints: 0, icon: Shield, color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-400" },
  { name: "Silver", minPoints: 200, icon: Award, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800/30", border: "border-slate-400" },
  { name: "Gold", minPoints: 500, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-400" },
  { name: "Platinum", minPoints: 1000, icon: Crown, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20", border: "border-cyan-400" },
  { name: "Diamond Eco-Warrior", minPoints: 2000, icon: Gem, color: "text-purple", bg: "bg-purple/10", border: "border-purple" },
];

export default function WasteTracker() {
  const [data, setData] = useState<WasteEntry[]>([
    { day: "Mon", generated: 2.5, recycled: 1.2 },
    { day: "Tue", generated: 3.1, recycled: 2.0 },
    { day: "Wed", generated: 1.8, recycled: 1.5 },
    { day: "Thu", generated: 4.0, recycled: 2.8 },
    { day: "Fri", generated: 2.2, recycled: 1.9 },
    { day: "Sat", generated: 3.5, recycled: 2.5 },
    { day: "Sun", generated: 1.0, recycled: 0.8 },
  ]);

  const [addDay, setAddDay] = useState("Mon");
  const [addGenerated, setAddGenerated] = useState("");
  const [addRecycled, setAddRecycled] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalGenerated = data.reduce((s, d) => s + d.generated, 0);
  const totalRecycled = data.reduce((s, d) => s + d.recycled, 0);
  const rate = totalGenerated > 0 ? Math.round((totalRecycled / totalGenerated) * 100) : 0;

  // Eco-Points calculated from recycling data
  const ecoPoints = useMemo(() => {
    return Math.round(totalRecycled * 30 + rate * 5 + data.length * 10);
  }, [totalRecycled, rate, data.length]);

  const currentLeague = useMemo(() => {
    for (let i = leagues.length - 1; i >= 0; i--) {
      if (ecoPoints >= leagues[i].minPoints) return i;
    }
    return 0;
  }, [ecoPoints]);

  const nextLeague = currentLeague < leagues.length - 1 ? leagues[currentLeague + 1] : null;
  const league = leagues[currentLeague];
  const LeagueIcon = league.icon;

  const progressToNext = nextLeague
    ? ((ecoPoints - league.minPoints) / (nextLeague.minPoints - league.minPoints)) * 100
    : 100;

  const handleAdd = useCallback(() => {
    const gen = parseFloat(addGenerated);
    const rec = parseFloat(addRecycled);
    if (isNaN(gen) || isNaN(rec) || gen < 0 || rec < 0) {
      toast.error("Enter valid positive numbers.");
      return;
    }
    if (rec > gen) {
      toast.error("Recycled cannot exceed generated.");
      return;
    }
    setData(prev => {
      const idx = prev.findIndex(d => d.day === addDay);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { day: addDay, generated: gen, recycled: rec };
        return updated;
      }
      return [...prev, { day: addDay, generated: gen, recycled: rec }];
    });
    toast.success(`Updated ${addDay}'s data.`);
    setAddGenerated("");
    setAddRecycled("");
    setDialogOpen(false);
  }, [addDay, addGenerated, addRecycled]);

  const metrics = [
    { label: "Weekly Waste", value: `${totalGenerated.toFixed(1)} kg`, icon: Flame, color: "text-eco-red" },
    { label: "Total Recycled", value: `${totalRecycled.toFixed(1)} kg`, icon: Leaf, color: "text-eco-green" },
    { label: "Recycling Rate", value: `${rate}%`, icon: TrendingUp, color: "text-eco-blue" },
    { label: "Eco Points", value: `${ecoPoints}`, icon: Trophy, color: "text-eco-yellow" },
  ];

  const goals = [
    { label: "Weekly Recycling Goal", current: totalRecycled, target: 15, unit: "kg" },
    { label: "Waste Reduction Target", current: Math.max(0, 30 - totalGenerated), target: 30, unit: "kg saved" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-eco-blue" />
            Waste Tracker
          </h1>
          <p className="text-sm text-muted-foreground">Weekly analytics & league progression — add entries to level up.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-sm font-heading">Add / Update Daily Entry</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Day</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={addDay} onChange={e => setAddDay(e.target.value)}>
                  {dayLabels.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Generated (kg)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="0.0" value={addGenerated} onChange={e => setAddGenerated(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Recycled (kg)</Label>
                  <Input type="number" min="0" step="0.1" placeholder="0.0" value={addRecycled} onChange={e => setAddRecycled(e.target.value)} />
                </div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleAdd}>Save Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* League Badge */}
      <Card className={`${league.bg} ${league.border} border-2`}>
        <CardContent className="p-5 flex items-center gap-4">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${league.bg} border ${league.border}`}>
            <LeagueIcon className={`h-8 w-8 ${league.color}`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading">{league.name}</h2>
              <Badge className="bg-foreground/10 text-foreground text-xs">{ecoPoints} pts</Badge>
            </div>
            {nextLeague ? (
              <>
                <p className="text-xs text-muted-foreground">
                  {nextLeague.minPoints - ecoPoints} more points to <span className="font-semibold">{nextLeague.name}</span>
                </p>
                <Progress value={progressToNext} className="h-2.5" />
              </>
            ) : (
              <p className="text-xs text-muted-foreground font-semibold">🎉 Max rank achieved!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(m => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center space-y-1">
              <m.icon className={`h-5 w-5 mx-auto ${m.color}`} />
              <p className="text-lg font-bold font-heading">{m.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Weekly Comparison — Generated vs Recycled (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="generated" name="Generated" fill="hsl(var(--eco-red))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recycled" name="Recycled" fill="hsl(var(--eco-green))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line trend */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Recycling Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.map(d => ({ ...d, rate: d.generated > 0 ? Math.round((d.recycled / d.generated) * 100) : 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
              <Line type="monotone" dataKey="rate" name="Rate %" stroke="hsl(var(--eco-blue))" strokeWidth={2} dot={{ fill: "hsl(var(--eco-blue))" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Goals */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm font-heading flex items-center gap-2">
          <Target className="h-4 w-4 text-eco-yellow" /> Goals
        </h2>
        {goals.map(g => (
          <Card key={g.label} className="glass-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-xs font-medium">{g.label}</span>
                <span className="text-xs text-muted-foreground">{g.current.toFixed(1)}/{g.target} {g.unit}</span>
              </div>
              <Progress value={Math.min(100, (g.current / g.target) * 100)} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
