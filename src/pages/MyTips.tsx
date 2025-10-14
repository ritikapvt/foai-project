import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Clock } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TimelineView } from "@/components/TimelineView";
import { TrendCards } from "@/components/TrendCards";
import { TipLog } from "@/components/TipLog";
import { MonthlySummary } from "@/components/MonthlySummary";

export default function MyTips() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        <BackButton />
        <Breadcrumbs />

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in pt-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Wellness History
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            A personal journal and progress record of your wellness journey
          </p>
        </div>

        {/* Trend Cards */}
        <TrendCards />

        {/* Monthly Summary */}
        <MonthlySummary />

        {/* Timeline View */}
        <div>
          <h2 className="font-heading text-2xl font-semibold mb-4">Daily Timeline (30 days)</h2>
          <TimelineView />
        </div>

        {/* Tip Log */}
        <TipLog />
      </div>
    </div>
  );
}
