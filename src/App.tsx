import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import Layout from "@/components/Layout";
import AIClassifier from "@/pages/AIClassifier";
import ScrapEstimation from "@/pages/ScrapEstimation";
import CollectionSchedule from "@/pages/CollectionSchedule";
import FacilityLocator from "@/pages/FacilityLocator";
import BulkyPickup from "@/pages/BulkyPickup";
import ReportDumping from "@/pages/ReportDumping";
import Guides from "@/pages/Guides";
import EWaste from "@/pages/EWaste";
import WasteTracker from "@/pages/WasteTracker";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CalendarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes — login is the landing page */}
              <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Protected app routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<AIClassifier />} />
                      <Route path="/schedule" element={<CollectionSchedule />} />
                      <Route path="/facilities" element={<FacilityLocator />} />
                      <Route path="/bulky-pickup" element={<BulkyPickup />} />
                      <Route path="/report" element={<ReportDumping />} />
                      <Route path="/guides" element={<Guides />} />
                      <Route path="/ewaste" element={<EWaste />} />
                      <Route path="/tracker" element={<WasteTracker />} />
                      <Route path="/scrap-estimation" element={<ScrapEstimation />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CalendarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
