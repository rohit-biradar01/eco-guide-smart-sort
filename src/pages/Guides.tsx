import { useState } from "react";
import { BookOpen, FileText, Search, Shield, Zap, Recycle, Leaf, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const guides = [
  {
    id: "bin-guide",
    title: "200+ Item Illustrated Bin Guide",
    description: "Visual reference for sorting 200+ common household items into the correct recycling bins.",
    icon: Recycle,
    tag: "PDF Reference",
    tagColor: "bg-primary/10 text-primary",
    keywords: "bin recycling sort plastic glass metal paper cardboard",
    pdfUrl: "", // TODO: Set your PDF URL here
  },
  {
    id: "ewaste-guide",
    title: "E-Waste Step-by-Step Disposal",
    description: "Complete safety guide for handling electronics, batteries, chemicals, and hazardous waste.",
    icon: Zap,
    tag: "Hazardous",
    tagColor: "bg-destructive/10 text-destructive",
    keywords: "ewaste electronic battery hazardous disposal chemical",
    pdfUrl: "",
  },
  {
    id: "composting",
    title: "Home Composting Guide",
    description: "Learn how to turn food scraps and yard waste into nutrient-rich compost.",
    icon: Leaf,
    tag: "Organic",
    tagColor: "bg-success/10 text-success",
    keywords: "compost organic food waste garden green",
    pdfUrl: "",
  },
  {
    id: "hazmat",
    title: "Hazardous Materials Safety",
    description: "Handling, storage, and transport guidelines for paint, solvents, pesticides, and medical waste.",
    icon: Shield,
    tag: "Safety",
    tagColor: "bg-warning/10 text-warning",
    keywords: "hazardous paint solvent pesticide medical safety",
    pdfUrl: "",
  },
];

export default function Guides() {
  const [search, setSearch] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState<typeof guides[0] | null>(null);

  const filtered = guides.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.keywords.includes(search.toLowerCase())
  );

  const openViewer = (guide: typeof guides[0]) => {
    setActiveGuide(guide);
    setViewerOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground">Searchable library of recycling guides, safety references, and disposal procedures.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guides..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(guide => (
          <Card
            key={guide.id}
            className="glass-card hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => openViewer(guide)}
          >
            <CardContent className="p-5 flex gap-4">
              <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent transition-colors shrink-0">
                <guide.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <CardTitle className="text-sm leading-tight">{guide.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{guide.description}</CardDescription>
                <Badge variant="secondary" className={`text-xs ${guide.tagColor}`}>{guide.tag}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No guides match your search.</p>
        )}
      </div>

      {/* Full-screen PDF viewer modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-sm">
              {activeGuide && <activeGuide.icon className="h-4 w-4 text-primary" />}
              {activeGuide?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-muted/30">
            {activeGuide?.pdfUrl ? (
              <iframe src={activeGuide.pdfUrl} className="w-full h-full" title={activeGuide.title} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <FileText className="h-14 w-14 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">PDF Viewer Ready</p>
                  <p className="text-xs text-muted-foreground/60 max-w-sm">
                    Set the <code className="bg-muted px-1 rounded">pdfUrl</code> property in the guides array to display your document here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
