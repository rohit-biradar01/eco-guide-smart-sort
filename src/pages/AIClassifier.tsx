import { useState } from "react";
import { Brain, Upload, Search, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AIClassifier() {
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          AI Waste Type Classifier
        </h1>
        <p className="text-muted-foreground">Identify waste types instantly using AI. Type an item name or upload a photo.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Text Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. plastic bottle, banana peel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button size="sm"><Sparkles className="h-4 w-4 mr-1" /> Classify</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Photo Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-6 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">{fileName ?? "Drop image here or click to browse"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
            </label>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">YOLOv Space Placeholder</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary">ML Model</Badge>
          </div>
          <CardDescription>Embed your Hugging Face YOLOv model below. Replace the src URL with your Space endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full border-t"
              src="about:blank"
              title="YOLOv Space Placeholder"
              allow="accelerometer; camera; microphone"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 pointer-events-none">
              <div className="text-center space-y-2">
                <Brain className="h-12 w-12 text-primary/40 mx-auto" />
                <p className="text-muted-foreground text-sm font-medium">YOLOv Model will render here</p>
                <p className="text-muted-foreground/60 text-xs">Replace iframe src with your Hugging Face Space URL</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
