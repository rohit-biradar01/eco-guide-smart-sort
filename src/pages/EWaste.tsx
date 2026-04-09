import { useState } from "react";
import { Zap, AlertTriangle, FileText, Shield, ChevronRight } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ewasteItems = [
  { name: "Batteries (Li-ion, NiMH)", steps: ["Remove from device", "Place in a zip-lock bag", "Drop at designated battery collection point", "Never dispose in general waste"] },
  { name: "Old Smartphones & Tablets", steps: ["Factory reset the device", "Remove SIM and SD cards", "Take to certified e-waste recycler", "Get a disposal certificate"] },
  { name: "CRT Monitors & TVs", steps: ["Do not break the screen (contains lead)", "Contact bulky pickup service", "Never place in regular recycling bin"] },
  { name: "Fluorescent Bulbs & CFLs", steps: ["Handle with care (contains mercury)", "Keep intact — do not crush", "Use designated hazardous waste drop-off"] },
  { name: "Paint & Solvents", steps: ["Keep in original container", "Never pour down drains", "Take to HazMat collection event", "Check local schedule for dates"] },
  { name: "Pesticides & Chemicals", steps: ["Keep tightly sealed", "Store upright during transport", "Deliver to hazardous waste facility only", "Never mix chemicals together"] },
];

export default function EWaste() {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Zap className="h-7 w-7 text-warning" />
          E-Waste & Hazardous Disposal
        </h1>
        <p className="text-muted-foreground">Step-by-step instructions for safe disposal of electronics and hazardous materials.</p>
      </div>

      <Card className="border-destructive/30 bg-destructive/5 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setPdfOpen(true)}>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors shrink-0">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              E-Waste & Hazardous Disposal Guide
              <Badge className="bg-destructive/15 text-destructive border-destructive/30" variant="outline">
                <AlertTriangle className="h-3 w-3 mr-1" /> Hazardous
              </Badge>
            </CardTitle>
            <CardDescription>Complete safety guide for handling electronics, batteries, chemicals, and other hazardous waste.</CardDescription>
            <span className="text-xs text-primary flex items-center gap-1 font-medium">Open PDF Guide <ChevronRight className="h-3 w-3" /></span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" /> Hazardous Disposal PDF
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/30 h-full">
            <div className="text-center space-y-3">
              <FileText className="h-16 w-16 text-destructive/30 mx-auto" />
              <p className="text-muted-foreground font-medium">PDF Viewer Placeholder</p>
              <p className="text-xs text-muted-foreground/60">Embed your hazardous disposal PDF here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Quick Reference — Step-by-Step</h2>
        <Accordion type="multiple" className="space-y-2">
          {ewasteItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass-card rounded-lg border px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2">
                  {i < 3 ? <Zap className="h-4 w-4 text-warning" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {item.name}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-1 ml-6">
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
        </Accordion>
      </div>
    </div>
  );
}
