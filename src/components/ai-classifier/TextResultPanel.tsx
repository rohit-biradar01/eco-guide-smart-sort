import { useNavigate } from "react-router-dom";
import { Recycle, Trash2, Leaf, AlertTriangle, Cpu, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClassificationResult } from "./types";
import { binColorStyles } from "./types";

const icons: Record<string, React.ReactNode> = {
  recycle: <Recycle className="h-5 w-5 text-blue-500" />,
  trash: <Trash2 className="h-5 w-5 text-gray-500" />,
  leaf: <Leaf className="h-5 w-5 text-emerald-500" />,
  alert: <AlertTriangle className="h-5 w-5 text-red-500" />,
  cpu: <Cpu className="h-5 w-5 text-orange-500" />,
};

export function TextResultLoading() {
  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function TextResultError({ message }: { message: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-6">
        <p className="text-sm text-destructive font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}

export default function TextResultPanel({ result }: { result: ClassificationResult }) {
  const navigate = useNavigate();
  const style = binColorStyles[result.bin_color] || binColorStyles["Black"];
  const icon = icons[style.iconName] || icons["trash"];

  return (
    <Card className={`${style.bg} ${style.border} border-2 transition-all animate-fade-in`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-bold text-foreground">{result.item}</h2>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.badge}`}>
            {result.category}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">{result.bin_color} Bin</span>
        </div>
        <p className="text-sm text-foreground/80">{result.instructions}</p>
        <div className="pt-2">
          {result.category === "E-Waste" ? (
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => navigate("/ewaste")}>
              View E-Waste Guide <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => navigate("/guides#pdf-viewer")}>
              Learn More in Knowledge Base <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
