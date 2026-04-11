import { useState, useRef } from "react";
import { Upload, Sparkles, X, ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { ImageClassificationResult } from "./types";

interface Props {
  onResult: (result: ImageClassificationResult) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function ImageClassificationCard({ onResult, onLoadingChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    setIsAnalyzing(true);
    onLoadingChange(true);
    toast.info("Analyzing image with ML model...");

    try {
      const { Client, handle_file } = await import("@gradio/client");
      const app = await Client.connect("sharmeeDas/OurWasteSegregator");

      // Convert file to a blob URL for handle_file
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);

      const result = await app.predict("/predict", [handle_file(blobUrl)]);
      URL.revokeObjectURL(blobUrl);

      const data = result.data as any[];
      // Gradio typically returns [image_output, text_output]
      // Parse based on actual Space response structure
      let segmentedImageUrl = "";
      let textOutput = "";

      for (const item of data) {
        if (item && typeof item === "object" && item.url) {
          segmentedImageUrl = item.url;
        } else if (typeof item === "string") {
          textOutput = item;
        }
      }

      // Parse classification text - try to extract category and confidence
      const confidenceMatch = textOutput.match(/(\d+(?:\.\d+)?)\s*%/);
      const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0;

      // Extract category from text
      const category = textOutput.split(/[:\-–]/)[0]?.trim() || textOutput.trim() || "Unknown";

      onResult({
        segmentedImageUrl,
        category,
        confidence,
        details: textOutput,
      });

      toast.success("Image analysis complete!");
    } catch (e: any) {
      console.error("HF Space error:", e);
      toast.error(e?.message || "Failed to analyze image. The ML model may be loading — try again in a moment.");
    } finally {
      setIsAnalyzing(false);
      onLoadingChange(false);
    }
  };

  return (
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
        <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full gradient-primary text-primary-foreground">
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
  );
}
