import { useState } from "react";
import { AlertTriangle, Upload, MapPin, Send, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: number;
  desc: string;
  status: "Reported" | "In Progress" | "Cleaned Up";
  date: string;
  location: string;
}

const mockReports: Report[] = [
  { id: 1, desc: "Pile of construction debris near park", status: "Cleaned Up", date: "2025-03-28", location: "28.6139, 77.2090" },
  { id: 2, desc: "Bags of garbage dumped by roadside", status: "In Progress", date: "2025-04-02", location: "28.6200, 77.2150" },
  { id: 3, desc: "Electronic waste near lake shore", status: "Reported", date: "2025-04-07", location: "28.6100, 77.2000" },
];

const statusConfig = {
  "Reported": { color: "bg-warning/15 text-warning border-warning/30", icon: Clock },
  "In Progress": { color: "bg-primary/15 text-primary border-primary/30", icon: Loader2 },
  "Cleaned Up": { color: "bg-success/15 text-success border-success/30", icon: CheckCircle },
};

export default function ReportDumping() {
  const [reports] = useState<Report[]>(mockReports);
  const [photo, setPhoto] = useState<string | null>(null);
  const [gps, setGps] = useState<string>("");
  const [desc, setDesc] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGps(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setGps("28.6139, 77.2090 (simulated)")
      );
    } else {
      setGps("28.6139, 77.2090 (simulated)");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-warning" />
          Report Illegal Dumping
        </h1>
        <p className="text-muted-foreground">Help keep your community clean by reporting illegal waste dumping.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">New Report</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-warning/30 rounded-lg p-6 cursor-pointer hover:border-warning/60 hover:bg-warning/5 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">{photo ?? "Upload evidence photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setPhoto(e.target.files?.[0]?.name ?? null)} />
            </label>

            <div className="flex gap-2">
              <Input placeholder="GPS coordinates" value={gps} readOnly className="flex-1" />
              <Button variant="outline" onClick={getLocation}>
                <MapPin className="h-4 w-4 mr-1" /> Get Location
              </Button>
            </div>

            <Textarea placeholder="Describe the issue..." value={desc} onChange={e => setDesc(e.target.value)} rows={3} />

            <Button className="w-full">
              <Send className="h-4 w-4 mr-1" /> Submit Report
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-semibold text-base">Status Tracking</h2>
          {reports.map(r => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <Card key={r.id} className="glass-card">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{r.desc}</p>
                    <Badge variant="outline" className={cfg.color}>
                      <Icon className="h-3 w-3 mr-1" /> {r.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{r.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
