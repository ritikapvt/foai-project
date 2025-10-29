import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { TrendingUp } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WeeklyInsights } from "@/components/WeeklyInsights";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-lilac/5 to-mint/10 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-10">
        <BackButton />
        <Breadcrumbs />

        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in pt-4">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold bg-gradient-to-r from-coral via-lilac to-mint bg-clip-text text-transparent">
              History
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your wellness journey week by week
          </p>
        </div>

        {/* Weekly Insights */}
        <section>
          <WeeklyInsights />
        </section>

        {/* Motivational Filler */}
        <section className="text-center space-y-4 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground italic">
              "Progress isn't always loud — it's in the calm moments you've built."
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Keep checking in to see your patterns and celebrate your growth
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
