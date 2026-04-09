import { useState } from "react";
import { BookOpen, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function Guides() {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          Recycling Guides
        </h1>
        <p className="text-muted-foreground">Comprehensive illustrated guides for proper waste sorting.</p>
      </div>

      <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setPdfOpen(true)}>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg">200+ Item Illustrated Bin Reference Guide</CardTitle>
            <CardDescription>A comprehensive visual guide covering 200+ common household items with clear sorting instructions.</CardDescription>
            <Badge variant="secondary">PDF Guide</Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>200+ Item Illustrated Bin Reference Guide</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/30 h-full">
            <div className="text-center space-y-3">
              <FileText className="h-16 w-16 text-primary/30 mx-auto" />
              <p className="text-muted-foreground font-medium">PDF Viewer Placeholder</p>
              <p className="text-xs text-muted-foreground/60">Embed your 200-image PDF here using an iframe or PDF.js viewer</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
