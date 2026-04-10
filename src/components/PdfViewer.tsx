import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  file: string;
  className?: string;
}

export default function PdfViewer({ file, className = "" }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument(file);
        const pdf = await loadingTask.promise;

        if (!cancelled) {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF load error:", err);
        if (!cancelled) {
          setError("Failed to load PDF");
          setLoading(false);
        }
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [file]);

  // Render page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      // Cancel any in-progress render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport,
      });

      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("Page render error:", err);
      }
    }
  }, [pdfDoc, pageNum, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">{error}</p>
          <a href={file} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
            Download instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40 shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            disabled={pageNum <= 1 || loading}
            onClick={() => setPageNum(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium min-w-[80px] text-center">
            {loading ? "Loading…" : `${pageNum} / ${numPages}`}
          </span>
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            disabled={pageNum >= numPages || loading}
            onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            disabled={loading}
            onClick={() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2)))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            disabled={loading}
            onClick={() => setScale(s => Math.min(3, +(s + 0.25).toFixed(2)))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center bg-muted/20 p-4">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading PDF…</span>
          </div>
        ) : (
          <canvas ref={canvasRef} className="shadow-lg" />
        )}
      </div>
    </div>
  );
}
