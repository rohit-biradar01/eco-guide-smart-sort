import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import AIClassifier from "@/pages/AIClassifier";
import CollectionSchedule from "@/pages/CollectionSchedule";
import FacilityLocator from "@/pages/FacilityLocator";
import BulkyPickup from "@/pages/BulkyPickup";
import ReportDumping from "@/pages/ReportDumping";
import Guides from "@/pages/Guides";
import EWaste from "@/pages/EWaste";
import WasteTracker from "@/pages/WasteTracker";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<AIClassifier />} />
            <Route path="/schedule" element={<CollectionSchedule />} />
            <Route path="/facilities" element={<FacilityLocator />} />
            <Route path="/bulky-pickup" element={<BulkyPickup />} />
            <Route path="/report" element={<ReportDumping />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/ewaste" element={<EWaste />} />
            <Route path="/tracker" element={<WasteTracker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
