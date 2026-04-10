import { BookOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Guides() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-eco-green" />
          Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground">
          Your centralized reference for waste sorting, recycling guidelines, and disposal procedures.
        </p>
      </div>

      <Card className="glass-card overflow-hidden" id="pdf-viewer">
        <CardContent className="p-0">
          <div className="relative w-full" style={{ height: "75vh", minHeight: 500 }}>
            <div className="flex items-center justify-center h-full bg-muted/20">
              <div className="text-center space-y-4">
                <div className="mx-auto h-24 w-24 rounded-2xl bg-eco-green/10 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-eco-green/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold font-heading text-muted-foreground">PDF Viewer Ready</p>
                  <p className="text-sm text-muted-foreground/60 max-w-md">
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
