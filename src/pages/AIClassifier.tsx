import { useState } from "react";
import { Brain, Upload, Search, Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ====================================================================
// HUGGING FACE SPACE URL — Replace with your deployed Space endpoint
// ====================================================================
const HF_SPACE_URL = "about:blank";
// Example: "https://your-username-your-space.hf.space"

export default function AIClassifier() {
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleClassify = () => {
    if (!query.trim()) {
      toast.error("Please enter an item name to classify.");
      return;
    }
    setIsClassifying(true);
    toast.info(`Classifying "${query}"... This will connect to your ML model API.`);
    // TODO: Wire to Hugging Face Inference API
    setTimeout(() => {
      setIsClassifying(false);
      toast.success("Classification ready — connect your Hugging Face API to see real results.");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success(`"${file.name}" uploaded. Ready for classification.`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Waste Classifier
        </h1>
        <p className="text-sm text-muted-foreground">Identify waste types using AI. Search by name or upload a photo for instant classification.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Text Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. plastic bottle, banana peel..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleClassify()}
              />
              <Button size="sm" onClick={handleClassify} disabled={isClassifying}>
                <Sparkles className="h-4 w-4 mr-1" /> Classify
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Photo Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-6 cursor-pointer hover:border-primary/60 hover:bg-accent/50 transition-colors">
              <Upload className="h-7 w-7 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">{fileName ?? "Drop image or click to browse"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Hugging Face Space iframe bridge */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">ML Model — Hugging Face Space</CardTitle>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              <ExternalLink className="h-3 w-3 mr-1" /> Bridge
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Replace <code className="bg-muted px-1 rounded text-xs">HF_SPACE_URL</code> at the top of this file with your deployed Space URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full border-t border-border"
              src={HF_SPACE_URL}
              title="Hugging Face Space"
              allow="accelerometer; camera; microphone"
            />
            {HF_SPACE_URL === "about:blank" && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
                <div className="text-center space-y-2">
                  <Brain className="h-10 w-10 text-primary/30 mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">Your ML Model will render here</p>
                  <p className="text-xs text-muted-foreground/60">Set HF_SPACE_URL to your Hugging Face Space endpoint</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
