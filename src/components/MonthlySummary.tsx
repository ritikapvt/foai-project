import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingDown, Sparkles } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const MonthlySummary = () => {
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

  const burnoutChange = lastMonthBurnout - avgBurnout;
  const improvementPercent = Math.abs(burnoutChange);

  // Determine most-used tip category (mock for now)
  const categories = ["Mind Reset", "Physical Break", "Sleep Hygiene"];
  const mostUsedCategory = categories[Math.floor(Math.random() * categories.length)];

  return (
    <Card className="card-hover bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <CardTitle className="font-heading">Monthly Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-good/20 rounded-full">
            <TrendingDown className="h-6 w-6 text-good" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">
              {burnoutChange > 0 ? "Burnout Reduced" : "Keep Going"}
            </h4>
            <p className="text-muted-foreground text-sm mb-3">
              {burnoutChange > 0 
                ? `Your burnout dropped by ${improvementPercent.toFixed(0)}% this month!`
                : `Your burnout increased by ${improvementPercent.toFixed(0)}%. Let's focus on recovery.`}
            </p>
            <Badge className="bg-good text-white">
              Avg Burnout: {avgBurnout.toFixed(0)}%
            </Badge>
          </div>
        </div>

        <div className="p-4 bg-background/60 backdrop-blur-sm rounded-xl">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">Most-Used Strategy</p>
              <p className="text-sm text-muted-foreground">{mostUsedCategory} tips helped you the most</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-xl text-center">
          <p className="text-sm font-medium text-foreground">
            {burnoutChange > 0 
              ? "🎉 Amazing progress! Keep nurturing your wellness journey."
              : "🌱 Small steps matter. You're building better habits every day."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
