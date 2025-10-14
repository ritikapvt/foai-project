import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCheckInHistory } from "@/lib/storage";
import { useState } from "react";

export const CalendarHeatmap = () => {
  const history = getCheckInHistory(30);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getBurnoutScore = (entry: any) => {
    return Math.min(100, Math.round(
      (entry.responses.stress_level / 10) * 40 + 
      ((10 - entry.responses.sleep_hours) / 10) * 30 + 
      ((entry.responses.work_hours || 8) / 12) * 30
    ));
  };

  const getColor = (score: number) => {
    if (score < 40) return "bg-good hover:bg-good/80";
    if (score < 70) return "bg-warn hover:bg-warn/80";
    return "bg-danger hover:bg-danger/80";
  };

  const calmDays = history.filter(e => getBurnoutScore(e) < 40).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {history.map((entry, index) => {
          const burnoutScore = getBurnoutScore(entry);
          const isHovered = hoveredDay === index;

          return (
            <div key={index} className="relative">
              <div
                className={`aspect-square rounded-xl ${getColor(burnoutScore)} 
                  transition-all duration-300 cursor-pointer
                  ${isHovered ? 'scale-110 shadow-lg z-10' : 'scale-100'}`}
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
              />
              
              {isHovered && (
                <Card className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-4 w-64 z-20 
                  animate-fade-in shadow-xl border-primary/20">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", { 
                        weekday: "long", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </p>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getColor(burnoutScore)}>
                        Burnout: {burnoutScore}%
                      </Badge>
                      <Badge variant="outline">Sleep: {entry.responses.sleep_hours}h</Badge>
                      <Badge variant="outline">Stress: {entry.responses.stress_level}/10</Badge>
                    </div>

                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-foreground/80 italic">
                        {burnoutScore < 40 
                          ? `"You slept ${entry.responses.sleep_hours}h and your stress was low. Keep it going! 🌿"`
                          : burnoutScore < 70
                          ? `"Your stress was ${entry.responses.stress_level}/10. Remember to take breaks. 💙"`
                          : `"High burnout day. You're resilient — tomorrow is a new chance. 🌟"`}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center p-4 bg-gradient-to-r from-good/10 to-good/5 rounded-xl">
        <p className="text-lg font-heading font-semibold text-foreground">
          You've had <span className="text-good text-xl">{calmDays}</span> calm days this month — your best streak yet 🌿
        </p>
      </div>
    </div>
  );
};
