import { BookOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Guides() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground">
          Your centralized reference for waste sorting, recycling guidelines, and disposal procedures.
        </p>
      </div>

      <Card className="glass-card overflow-hidden" id="pdf-viewer">
        <CardContent className="p-0">
          <div className="relative w-full" style={{ height: "70vh", minHeight: 400 }}>
            {/* TODO: Replace with actual PDF iframe src */}
            <div className="flex items-center justify-center h-full bg-muted/20">
              <div className="text-center space-y-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-muted-foreground">PDF Viewer Ready</p>
                  <p className="text-xs text-muted-foreground/60 max-w-sm">
                    Your comprehensive waste management guide will be displayed here. Link your PDF to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
