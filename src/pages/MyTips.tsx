import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Sparkles } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { MonthlyRecap } from "@/components/MonthlyRecap";
import { MoodEvolution } from "@/components/MoodEvolution";
import { AIReflections } from "@/components/AIReflections";
import { MyRitualsBoard } from "@/components/MyRitualsBoard";
import { Milestones } from "@/components/Milestones";
import { FutureSelfMessage } from "@/components/FutureSelfMessage";

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
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold bg-gradient-to-r from-coral via-lilac to-mint bg-clip-text text-transparent">
              My Journey
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            A calm yet celebratory visualization of your wellness growth — see and feel your progress over time
          </p>
        </div>

        {/* Calendar Heatmap */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Your Wellness Calendar
          </h2>
          <CalendarHeatmap />
        </section>

        {/* Monthly Recap */}
        <section>
          <MonthlyRecap />
        </section>

        {/* Mood Evolution */}
        <section>
          <MoodEvolution />
        </section>

        {/* AI Reflections */}
        <section>
          <AIReflections />
        </section>

        {/* Milestones */}
        <section>
          <Milestones />
        </section>

        {/* My Rituals Board */}
        <section>
          <MyRitualsBoard />
        </section>

        {/* Future Self Message */}
        <section>
          <FutureSelfMessage />
        </section>
      </div>
    </div>
  );
}
