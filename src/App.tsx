import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { ProfileModal } from "@/components/ProfileModal";
import Onboarding from "./pages/Onboarding";
import Baseline from "./pages/Baseline";
import Dashboard from "./pages/Dashboard";
import DailyCheckin from "./pages/DailyCheckin";
import Result from "./pages/Result";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { isOnboarded } from "@/lib/storage";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppBar onProfileClick={() => setProfileOpen(true)} />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/baseline"
            element={
              <AppLayout>
                <Baseline />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/daily-checkin"
            element={
              <AppLayout>
                <DailyCheckin />
              </AppLayout>
            }
          />
          <Route
            path="/result"
            element={
              <AppLayout>
                <Result />
              </AppLayout>
            }
          />
          <Route
            path="/learn"
            element={
              <AppLayout>
                <Learn />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
