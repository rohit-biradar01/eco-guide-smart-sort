import { BarChart3, TrendingUp, Trophy, Flame, Leaf, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const weeklyData = [
  { week: "Wk 1", generated: 12, recycled: 5 },
  { week: "Wk 2", generated: 10, recycled: 6 },
  { week: "Wk 3", generated: 14, recycled: 9 },
  { week: "Wk 4", generated: 8, recycled: 7 },
  { week: "Wk 5", generated: 11, recycled: 8 },
  { week: "Wk 6", generated: 9, recycled: 8 },
  { week: "Wk 7", generated: 7, recycled: 6 },
  { week: "Wk 8", generated: 6, recycled: 5.5 },
];

const metrics = [
  { label: "Current Streak", value: "12 days", icon: Flame, color: "text-warning" },
  { label: "Total Diverted", value: "54.5 kg", icon: Leaf, color: "text-primary" },
  { label: "Recycling Rate", value: "72%", icon: TrendingUp, color: "text-success" },
  { label: "Eco Score", value: "850 pts", icon: Trophy, color: "text-earth" },
];

const goals = [
  { label: "Weekly Recycling Goal", current: 6, target: 8, unit: "kg" },
  { label: "Monthly Waste Reduction", current: 35, target: 50, unit: "kg" },
  { label: "Community Challenge", current: 72, target: 100, unit: "items" },
];

export default function WasteTracker() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          Waste Reduction Tracker
        </h1>
        <p className="text-muted-foreground">Track your personal waste metrics and environmental impact.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(m => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center space-y-1">
              <m.icon className={`h-6 w-6 mx-auto ${m.color}`} />
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Weekly Comparison — Generated vs Recycled (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Bar dataKey="generated" name="Waste Generated" fill="hsl(var(--chart-amber))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recycled" name="Waste Recycled" fill="hsl(var(--chart-green))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Gamified Goals</h2>
        {goals.map(g => (
          <Card key={g.label} className="glass-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{g.label}</span>
                <span className="text-muted-foreground">{g.current}/{g.target} {g.unit}</span>
              </div>
              <Progress value={(g.current / g.target) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
