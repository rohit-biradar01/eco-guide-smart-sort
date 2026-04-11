import { useState } from "react";
import { Brain } from "lucide-react";
import TextClassificationCard from "@/components/ai-classifier/TextClassificationCard";
import ImageClassificationCard from "@/components/ai-classifier/ImageClassificationCard";
import TextResultPanel, { TextResultLoading, TextResultError } from "@/components/ai-classifier/TextResultPanel";
import ImageResultPanel, { ImageResultLoading } from "@/components/ai-classifier/ImageResultPanel";
import type { ClassificationResult, ImageClassificationResult } from "@/components/ai-classifier/types";

export default function AIClassifier() {
  const [textLoading, setTextLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [textResult, setTextResult] = useState<ClassificationResult | null>(null);
  const [imageResult, setImageResult] = useState<ImageClassificationResult | null>(null);
  const [error, setError] = useState("");

  const handleScanNew = () => {
    setImageResult(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <Brain className="h-6 w-6 text-eco-green" />
          AI Waste Classifier
        </h1>
        <p className="text-sm text-muted-foreground">
          Identify waste types using AI. Search by name or upload a photo for instant classification.
        </p>
      </div>

      {/* Input Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <TextClassificationCard
          onResult={(r) => { setTextResult(r); setError(""); }}
          onError={setError}
          onLoadingChange={setTextLoading}
        />
        <ImageClassificationCard
          onResult={setImageResult}
          onLoadingChange={setImageLoading}
        />
      </div>

      {/* Text Classification Results */}
      {textLoading && <TextResultLoading />}
      {error && !textLoading && <TextResultError message={error} />}
      {textResult && !textLoading && <TextResultPanel result={textResult} />}

      {/* Image Classification Results */}
      {imageLoading && <ImageResultLoading />}
      {imageResult && !imageLoading && (
        <ImageResultPanel result={imageResult} onScanNew={handleScanNew} />
      )}
    </div>
  );
}
