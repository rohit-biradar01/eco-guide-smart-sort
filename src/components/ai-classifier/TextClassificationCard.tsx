import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ClassificationResult } from "./types";

interface Props {
  onResult: (result: ClassificationResult) => void;
  onError: (msg: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function TextClassificationCard({ onResult, onError, onLoadingChange }: Props) {
  const [query, setQuery] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);

  const handleClassify = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("Please enter an item name to classify.");
      return;
    }
    setIsClassifying(true);
    onLoadingChange(true);
    onError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-waste", {
        body: { item: trimmed },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      onResult(data as ClassificationResult);
      toast.success(`"${data.item}" classified as ${data.category}!`);
    } catch (e: any) {
      const msg = e?.message || "Unable to classify this item right now.";
      onError(msg);
      toast.error(msg);
    } finally {
      setIsClassifying(false);
      onLoadingChange(false);
    }
  };

  return (
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
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleClassify()}
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
  );
}
