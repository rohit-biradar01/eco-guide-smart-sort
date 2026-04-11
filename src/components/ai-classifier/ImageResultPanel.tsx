import { useNavigate } from "react-router-dom";
import { Eye, RotateCcw, ArrowRight, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { ImageClassificationResult } from "./types";

export function ImageResultLoading() {
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Processing image with ML model…
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

interface Props {
  result: ImageClassificationResult;
  onScanNew: () => void;
}

export default function ImageResultPanel({ result, onScanNew }: Props) {
  const navigate = useNavigate();
  const confidenceColor =
    result.confidence >= 80 ? "text-emerald-600 dark:text-emerald-400" :
    result.confidence >= 50 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  return (
    <Card className="glass-card overflow-hidden border-2 border-primary/20 animate-fade-in">
      <CardContent className="p-0">
        {/* Dual-output layout */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Segmented Image Result */}
          <div className="relative bg-muted/30 flex items-center justify-center min-h-[240px] border-b md:border-b-0 md:border-r border-border">
            {result.segmentedImageUrl ? (
              <img
                src={result.segmentedImageUrl}
                alt="AI Segmented Result"
                className="w-full h-full object-contain max-h-[320px] p-3 rounded-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
                <span className="text-sm">No segmented image returned</span>
              </div>
            )}
            <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-background/80 backdrop-blur px-2 py-0.5 rounded-full text-muted-foreground border border-border">
              AI Output
            </span>
          </div>

          {/* Classification Text Result */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Category Header */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Primary Category</span>
                <h3 className="text-xl font-bold text-foreground mt-0.5 leading-tight">{result.category}</h3>
              </div>

              {/* Confidence Score */}
              {result.confidence > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Confidence</span>
                    <span className={`text-sm font-bold ${confidenceColor}`}>{result.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>
              )}

              {/* Details / Instructions */}
              {result.details && (
                <div className="bg-muted/40 rounded-lg p-3 border border-border">
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.details}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={onScanNew} className="gradient-primary text-primary-foreground">
                <RotateCcw className="h-4 w-4 mr-2" /> Scan New Item
              </Button>
              <Button variant="outline" onClick={() => navigate("/guides#pdf-viewer")}>
                <Eye className="h-4 w-4 mr-2" /> View Disposal Guide <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
