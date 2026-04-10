import { BookOpen } from "lucide-react";
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
            <object
              data="/Waste_Classification_Guide.pdf"
              type="application/pdf"
              className="w-full h-full"
            >
              <p className="p-8 text-center text-muted-foreground">
                Unable to display PDF.{" "}
                <a href="/Waste_Classification_Guide.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Download it here
                </a>.
              </p>
            </object>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}