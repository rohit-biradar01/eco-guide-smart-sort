import { useState, useRef } from "react";
import { IndianRupee, Upload, ImageIcon, X, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix to get raw base64
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScrapEstimation() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped || !dropped.type.startsWith("image/")) return;
    setFile(dropped);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(dropped);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEstimate = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const { data, error: fnError } = await supabase.functions.invoke("estimate-scrap", {
        body: { image: base64, mimeType: file.type },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data.analysis);
      toast.success("Scrap analysis complete!");
    } catch (e: any) {
      const msg = e?.message || "Failed to analyze image. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <IndianRupee className="h-6 w-6 text-primary" />
          Scrap Rate Estimation
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload a photo of scrap material to get an estimated market price in INR per kg.
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" /> Upload Scrap Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!preview ? (
            <label
              className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-xl p-10 cursor-pointer hover:border-primary/60 hover:bg-accent/10 transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <span className="text-sm text-muted-foreground font-medium">
                Drag & drop or click to select an image
              </span>
              <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP supported</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="Scrap material" className="w-full max-h-72 object-contain rounded-xl border border-border bg-muted/20" />
              <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={clearImage}>
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2 truncate">{file?.name}</p>
            </div>
          )}

          <Button
            onClick={handleEstimate}
            disabled={!file || isLoading}
            className="w-full gradient-primary text-primary-foreground"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Estimating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Estimate Scrap Value</>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && !isLoading && (
        <Card className="glass-card border-primary/30 border-2 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" /> Estimation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 whitespace-pre-wrap">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
