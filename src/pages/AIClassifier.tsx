import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Upload, Search, Sparkles, ExternalLink, X, ImageIcon, Loader2, Recycle, Trash2, Leaf, AlertTriangle, Cpu, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ====================================================================
// HUGGING FACE SPACE URL — Replace with your deployed Space endpoint
// ====================================================================
const HF_SPACE_URL = "about:blank";

interface ClassificationResult {
  item: string;
  category: string;
  bin_color: string;
  instructions: string;
}

const binColorStyles: Record<string, { bg: string; border: string; badge: string; icon: React.ReactNode }> = {
  Blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-400 dark:border-blue-500",
    badge: "bg-blue-500 text-white",
    icon: <Recycle className="h-5 w-5 text-blue-500" />,
  },
  Black: {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    border: "border-gray-500 dark:border-gray-400",
    badge: "bg-gray-700 text-white",
    icon: <Trash2 className="h-5 w-5 text-gray-500" />,
  },
  Green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-400 dark:border-emerald-500",
    badge: "bg-emerald-500 text-white",
    icon: <Leaf className="h-5 w-5 text-emerald-500" />,
  },
  Red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-400 dark:border-red-500",
    badge: "bg-red-500 text-white",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
  },
  Orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-400 dark:border-orange-500",
    badge: "bg-orange-500 text-white",
    icon: <Cpu className="h-5 w-5 text-orange-500" />,
  },
};

export default function AIClassifier() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClassify = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("Please enter an item name to classify.");
      return;
    }
    setIsClassifying(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-waste", {
        body: { item: trimmed },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data as ClassificationResult);
      toast.success(`"${data.item}" classified as ${data.category}!`);
    } catch (e: any) {
      const msg = e?.message || "Unable to classify this item right now. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsClassifying(false);
    }
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

  const style = result ? binColorStyles[result.bin_color] || binColorStyles["Black"] : null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <Brain className="h-6 w-6 text-eco-green" />
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
                placeholder="What do you need to throw away?"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleClassify()}
              />
              <Button size="sm" onClick={handleClassify} disabled={isClassifying} className="gradient-primary text-primary-foreground">
                {isClassifying ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Classifying...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-1" /> Classify</>
                )}
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
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Analyze Image</>
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

      {/* Classification Result Card */}
      {isClassifying && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {error && !isClassifying && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && !isClassifying && style && (
        <Card className={`${style.bg} ${style.border} border-2 transition-all animate-fade-in`}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              {style.icon}
              <h2 className="text-xl font-bold text-foreground">{result.item}</h2>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.badge}`}>
                {result.category}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {result.bin_color} Bin
              </span>
            </div>
            <p className="text-sm text-foreground/80">{result.instructions}</p>
            <div className="pt-2">
              {result.category === "E-Waste" ? (
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground"
                  onClick={() => navigate("/ewaste")}
                >
                  View E-Waste Guide <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground"
                  onClick={() => navigate("/guides#pdf-viewer")}
                >
                  Learn More in Knowledge Base <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
