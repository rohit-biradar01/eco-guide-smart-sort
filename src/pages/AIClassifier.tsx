import { useState, useRef } from "react";
import { Brain, Upload, Search, Sparkles, ExternalLink, X, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ====================================================================
// HUGGING FACE SPACE URL — Replace with your deployed Space endpoint
// ====================================================================
const HF_SPACE_URL = "about:blank";

export default function AIClassifier() {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClassify = () => {
    if (!query.trim()) {
      toast.error("Please enter an item name to classify.");
      return;
    }
    setIsClassifying(true);
    toast.info(`Classifying "${query}"...`);
    // TODO: Wire to Hugging Face Inference API
    setTimeout(() => {
      setIsClassifying(false);
      toast.success("Classification ready — connect your Hugging Face API to see real results.");
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    setIsAnalyzing(true);
    toast.info("Analyzing image with ML model...");
    // TODO: Send image to Hugging Face Inference API
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete — connect your ML endpoint for real results.");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Waste Classifier
        </h1>
        <p className="text-sm text-muted-foreground">Identify waste types using AI. Search by name or upload a photo for instant classification.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Text Classification */}
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
              <Button size="sm" onClick={handleClassify} disabled={isClassifying} className="gradient-primary text-primary-foreground">
                <Sparkles className="h-4 w-4 mr-1" /> Classify
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload with Preview */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Image Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-xl p-6 cursor-pointer hover:border-primary/60 hover:bg-accent/10 transition-all">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground font-medium">Click to select an image</span>
                <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP supported</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            ) : (
              <div className="relative">
                <img src={preview} alt="Selected" className="w-full h-48 object-cover rounded-xl border border-border" />
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={clearImage}>
                  <X className="h-3 w-3" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2 truncate">{file?.name}</p>
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full gradient-primary text-primary-foreground"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> Analyze Image
                </>
              )}
            </Button>
            {isAnalyzing && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hugging Face Space iframe bridge */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">ML Model — Hugging Face Space</CardTitle>
            <Badge variant="secondary" className="text-xs bg-accent/15 text-accent">
              <ExternalLink className="h-3 w-3 mr-1" /> Bridge
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Replace <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">HF_SPACE_URL</code> at the top of this file with your deployed Space URL.
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
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary/40" />
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">Your ML Model will render here</p>
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
