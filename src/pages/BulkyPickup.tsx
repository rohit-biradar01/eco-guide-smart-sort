import { useState } from "react";
import { Truck, MapPin, Package, CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/contexts/CalendarContext";

const categories = ["Furniture", "Large Appliances", "Mattress / Bedding", "Electronics", "Construction Debris", "Other"];
const timeSlots = ["8:00 AM – 10:00 AM", "10:00 AM – 12:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM"];

export default function BulkyPickup() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addEvent } = useCalendar();

  const steps = ["Contact", "Item Details", "Schedule", "Confirm"];

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0 && phone.trim().length > 0 && address.trim().length > 0;
    if (step === 1) return category.length > 0;
    if (step === 2) return !!date && time.length > 0;
    return true;
  };

  const disableDate = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today || d.getDay() === 0;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      // Push to shared calendar state
      if (date) {
        addEvent({
          date,
          type: "Bulky Pickup",
          label: `${category} — ${time}`,
        });
      }
      setSubmitting(false);
      toast.success("Pickup scheduled! Check your Collection Calendar to see it.");
      setStep(0); setName(""); setPhone(""); setAddress(""); setCategory(""); setItemDesc(""); setDate(undefined); setTime(""); setNotes("");
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-purple" />
          Bulky Item Pickup
        </h1>
        <p className="text-sm text-muted-foreground">Schedule a special collection — it appears on your Collection Calendar automatically.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all shrink-0",
              i < step ? "bg-success text-success-foreground" : i === step ? "gradient-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
            )}>
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs hidden sm:inline text-muted-foreground">{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Contact & Address</CardTitle>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone *</Label>
                  <Input placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Pickup Address *</Label>
                <Input placeholder="Full street address" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Additional Notes</Label>
                <Textarea placeholder="Gate code, floor number, etc." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <CardTitle className="text-sm flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Item Details</CardTitle>
              <div className="space-y-1">
                <Label className="text-xs">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select item category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea placeholder="Describe the item (size, weight, condition...)" value={itemDesc} onChange={e => setItemDesc(e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" /> Select Date & Time</CardTitle>
              <div className="space-y-1">
                <Label className="text-xs">Pickup Date * (Sundays unavailable)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} className="pointer-events-auto" disabled={disableDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Time Slot *</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Review & Submit</CardTitle>
              <div className="grid gap-2 text-sm">
                {[
                  ["Name", name],
                  ["Phone", phone],
                  ["Address", address],
                  ["Category", category],
                  ["Date", date ? format(date, "PPP") : "—"],
                  ["Time", time],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center p-2.5 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground text-xs">{label}</span>
                    <span className="font-medium text-xs">{val || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 3 ? (
              <Button size="sm" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="gradient-primary text-primary-foreground">
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSubmit} disabled={submitting} className="gradient-primary text-primary-foreground">
                {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                Submit Request
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
