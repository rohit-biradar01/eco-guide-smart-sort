import { useState, useRef } from "react";
import { AlertTriangle, Upload, Send, Clock, CheckCircle, Loader2, Navigation, X, ImageIcon, Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Report {
  id: string;
  description: string;
  status: "Received" | "Investigating" | "Resolved";
  date: string;
  lat: number;
  lng: number;
  photo?: string;
}

const statusConfig = {
  Received: { color: "bg-warning/15 text-warning border-warning/30", icon: Clock },
  Investigating: { color: "bg-info/15 text-info border-info/30", icon: Loader2 },
  Resolved: { color: "bg-success/15 text-success border-success/30", icon: CheckCircle },
};

export default function ReportDumping() {
  const [reports, setReports] = useState<Report[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [desc, setDesc] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
        toast.success("Coordinates captured successfully.");
      },
      err => {
        setLocating(false);
        toast.error(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!desc.trim()) { toast.error("Please provide a description."); return; }
    if (!lat || !lng) { toast.error("Please capture your coordinates."); return; }
    setSubmitting(true);
    setTimeout(() => {
      const newReport: Report = {
        id: crypto.randomUUID(),
        description: desc,
        status: "Received",
        date: new Date().toISOString().split("T")[0],
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        photo: photo?.name,
      };
      setReports(prev => [newReport, ...prev]);
      // Simulate status progression
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: "Investigating" } : r));
      }, 5000);
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: "Resolved" } : r));
      }, 12000);

      setDesc(""); setPhoto(null); setPreview(null); setLat(""); setLng("");
      setSubmitting(false);
      toast.success("Report submitted! Watch status updates below.");
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-warning" />
          Report Illegal Dumping
        </h1>
        <p className="text-sm text-muted-foreground">Submit GPS-tagged reports with photo evidence. Track resolution status in real-time.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm">New Report</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-warning/30 rounded-xl p-5 cursor-pointer hover:border-warning/60 hover:bg-warning/5 transition-all">
                <ImageIcon className="h-7 w-7 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">Upload evidence photo</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            ) : (
              <div className="relative">
                <img src={preview} alt="Evidence" className="w-full h-40 object-cover rounded-xl border border-border" />
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={clearPhoto}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
                <Input placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={getLocation} disabled={locating}>
                {locating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Navigation className="h-4 w-4 mr-1" />}
                {locating ? "Detecting..." : "Get Current Coordinates"}
              </Button>
            </div>

            <Textarea placeholder="Describe the issue in detail..." value={desc} onChange={e => setDesc(e.target.value)} rows={3} />

            <Button className="w-full gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
              Submit Report
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Live Status Tracking</h2>
          {reports.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                <p className="font-medium">No reports yet</p>
                <p className="text-xs mt-1 text-muted-foreground/60">Submit a report to start tracking progress.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(r => {
                    const cfg = statusConfig[r.status];
                    const Icon = cfg.icon;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs whitespace-nowrap">{r.date}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{r.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${cfg.color} text-xs`}>
                            <Icon className={`h-3 w-3 mr-1 ${r.status === "Investigating" ? "animate-spin" : ""}`} /> {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
