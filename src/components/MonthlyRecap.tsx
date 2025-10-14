import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown, Moon, Heart } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const MonthlyRecap = () => {
  const history = getCheckInHistory(30);

  const avgBurnout = history.length > 0
    ? history.reduce((sum, e) => {
        const burnout = Math.min(100, Math.round(
          (e.responses.stress_level / 10) * 40 + 
          ((10 - e.responses.sleep_hours) / 10) * 30 + 
          ((e.responses.work_hours || 8) / 12) * 30
        ));
        return sum + burnout;
      }, 0) / history.length
    : 0;

  const avgSleep = history.length > 0
    ? (history.reduce((sum, e) => sum + e.responses.sleep_hours, 0) / history.length).toFixed(1)
    : 0;

  const lastMonthBurnout = history.length >= 15 
    ? history.slice(15, 30).reduce((sum, e) => {
        const burnout = Math.min(100, Math.round(
          (e.responses.stress_level / 10) * 40 + 
          ((10 - e.responses.sleep_hours) / 10) * 30 + 
          ((e.responses.work_hours || 8) / 12) * 30
        ));
        return sum + burnout;
      }, 0) / 15
    : avgBurnout;

  const burnoutChange = Math.abs(lastMonthBurnout - avgBurnout);

  const recapCards = [
    {
      title: "Your Calmest Week",
      value: "Week 3",
      icon: Sparkles,
      gradient: "from-lilac/20 to-mint/20",
      color: "text-primary"
    },
    {
      title: "Average Sleep Hours",
      value: `${avgSleep}h`,
      icon: Moon,
      gradient: "from-mint/20 to-cream/20",
      color: "text-good"
    },
    {
      title: "Most Helpful Tip",
      value: "Evening Walk",
      icon: Heart,
      gradient: "from-coral/20 to-lilac/20",
      color: "text-secondary"
    },
    {
      title: "Burnout Reduced By",
      value: `${burnoutChange.toFixed(0)}%`,
      icon: TrendingDown,
      gradient: "from-cream/20 to-coral/20",
      color: "text-good"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="font-heading text-3xl font-bold bg-gradient-to-r from-coral via-lilac to-mint bg-clip-text text-transparent">
          Your Monthly Highlight Reel
        </h2>
        <p className="text-muted-foreground italic">
          "Progress isn't loud — it's in the calm moments you've built."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recapCards.map((card, index) => (
          <Card 
            key={index} 
            className={`card-hover bg-gradient-to-br ${card.gradient} border-none shadow-lg
              animate-fade-in transition-all duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-background/60 ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
              </div>
              <p className={`text-4xl font-bold font-heading ${card.color}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-good/10 to-primary/10 rounded-2xl text-center 
        border-2 border-good/20 animate-fade-in">
        <p className="text-xl font-heading font-semibold text-foreground">
          🎉 Amazing progress! You're building a healthier routine every day.
        </p>
      </div>
    </div>
  );
};
