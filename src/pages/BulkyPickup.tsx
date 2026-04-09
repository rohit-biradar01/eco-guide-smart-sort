import { useState } from "react";
import { Truck, MapPin, Package, CalendarIcon, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categories = ["Furniture", "Appliances", "Mattress", "Electronics", "Construction Debris", "Other"];
const timeSlots = ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "1:00 PM - 3:00 PM", "3:00 PM - 5:00 PM"];

export default function BulkyPickup() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const steps = ["Address", "Item Details", "Schedule", "Confirm"];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Truck className="h-7 w-7 text-primary" />
          Bulky Item Pickup
        </h1>
        <p className="text-muted-foreground">Schedule a special pickup for large items.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-colors",
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>{i + 1}</div>
            <span className="text-xs hidden sm:inline">{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Pickup Address</CardTitle>
              <Input placeholder="Enter your full address" value={address} onChange={e => setAddress(e.target.value)} />
              <Textarea placeholder="Apartment number, gate code, etc." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Item Details</CardTitle>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select item category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-base flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" /> Pick Date & Time</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="pointer-events-auto" disabled={d => d < new Date()} />
                </PopoverContent>
              </Popover>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Confirm Pickup</CardTitle>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded"><span className="text-muted-foreground">Address</span><span className="font-medium">{address || "—"}</span></div>
                <div className="flex justify-between p-2 bg-muted/50 rounded"><span className="text-muted-foreground">Category</span><Badge variant="secondary">{category || "—"}</Badge></div>
                <div className="flex justify-between p-2 bg-muted/50 rounded"><span className="text-muted-foreground">Date</span><span className="font-medium">{date ? format(date, "PPP") : "—"}</span></div>
                <div className="flex justify-between p-2 bg-muted/50 rounded"><span className="text-muted-foreground">Time</span><span className="font-medium">{time || "—"}</span></div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button className="animate-pulse-glow" onClick={() => { setStep(0); setAddress(""); setCategory(""); setDate(undefined); setTime(""); setNotes(""); }}>
                <CheckCircle className="h-4 w-4 mr-1" /> Submit Request
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
