import { useState } from "react";
import { Zap, AlertTriangle, FileText, Shield, ChevronRight, Search } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ewasteItems = [
  { name: "Batteries (Li-ion, NiMH)", category: "Electronics", steps: ["Remove from device", "Place in a zip-lock bag", "Drop at designated battery collection point", "Never dispose in general waste"] },
  { name: "Old Smartphones & Tablets", category: "Electronics", steps: ["Factory reset the device", "Remove SIM and SD cards", "Take to certified e-waste recycler", "Get a disposal certificate"] },
  { name: "CRT Monitors & TVs", category: "Electronics", steps: ["Do not break the screen (contains lead)", "Contact bulky pickup service", "Never place in regular recycling bin"] },
  { name: "Fluorescent Bulbs & CFLs", category: "Hazardous", steps: ["Handle with care (contains mercury)", "Keep intact — do not crush", "Use designated hazardous waste drop-off"] },
  { name: "Paint & Solvents", category: "Hazardous", steps: ["Keep in original container", "Never pour down drains", "Take to HazMat collection event", "Check local schedule for dates"] },
  { name: "Pesticides & Chemicals", category: "Hazardous", steps: ["Keep tightly sealed", "Store upright during transport", "Deliver to hazardous waste facility only", "Never mix chemicals together"] },
  { name: "Printer Cartridges", category: "Electronics", steps: ["Check manufacturer take-back programs", "Use cartridge recycling drop-offs at office supply stores", "Do not disassemble or puncture"] },
  { name: "Old Cables & Chargers", category: "Electronics", steps: ["Bundle and tie cables together", "Drop at e-waste collection bins", "Some retailers accept for recycling"] },
];

export default function EWaste() {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ewasteItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <Zap className="h-6 w-6 text-eco-yellow" />
          E-Waste & Hazardous Disposal
        </h1>
        <p className="text-sm text-muted-foreground">Step-by-step instructions for safe disposal of electronics and hazardous materials.</p>
      </div>

      <Card className="border-destructive/20 bg-destructive/5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setPdfOpen(true)}>
        <CardContent className="p-5 flex items-center gap-5">
          <div className="h-16 w-16 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors shrink-0">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-1 flex-1">
            <CardTitle className="text-sm flex items-center gap-2">
              E-Waste & Hazardous Disposal Guide
              <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs" variant="outline">
                <AlertTriangle className="h-3 w-3 mr-1" /> Hazardous
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">Complete safety guide — Open in full-screen viewer</CardDescription>
            <span className="text-xs text-primary flex items-center gap-1 font-medium">Open PDF <ChevronRight className="h-3 w-3" /></span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-destructive" /> E-Waste & Hazardous Disposal PDF
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-muted/30">
            <iframe
              src="/EWaste_Hazardous_Disposal_Guide.pdf"
              title="E-Waste & Hazardous Disposal Guide"
              className="w-full h-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Quick Reference</h2>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 h-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Accordion type="multiple" className="space-y-2">
          {filtered.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass-card rounded-lg border px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2">
                  {item.category === "Electronics" ? <Zap className="h-4 w-4 text-warning" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {item.name}
                  <Badge variant="secondary" className="text-[10px] ml-1">{item.category}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-1.5 ml-6">
                  {item.steps.map((s, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{j + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No items match your search.</p>
          )}
        </Accordion>
      </div>
    </div>
  );
}
