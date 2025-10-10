import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { DAILY_TIPS } from "@/lib/learningModules";

export function TodayTipCard() {
  // Cycle daily based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const tip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length];

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Today's Tip</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{tip}</p>
      </CardContent>
    </Card>
  );
}