import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCheckInHistory } from "@/lib/storage";

export const TimelineView = () => {
  const history = getCheckInHistory(30);

  const getBurnoutColor = (score: number) => {
    if (score < 40) return "bg-good text-white";
    if (score < 70) return "bg-warn";
    return "bg-danger text-white";
  };

  const getBurnoutLabel = (score: number) => {
    if (score < 40) return "Low";
    if (score < 70) return "Medium";
    return "High";
  };

  return (
    <div className="space-y-4">
      {history.map((entry, index) => {
        const burnoutScore = Math.min(100, Math.round(
          (entry.responses.stress_level / 10) * 40 + 
          ((10 - entry.responses.sleep_hours) / 10) * 30 + 
          ((entry.responses.work_hours || 8) / 12) * 30
        ));

        return (
          <Card key={index} className="card-hover group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", { 
                        weekday: "long", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </div>
                    <Badge className={getBurnoutColor(burnoutScore)}>
                      {getBurnoutLabel(burnoutScore)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Burnout</p>
                      <p className="text-lg font-bold font-heading">{burnoutScore}%</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Sleep</p>
                      <p className="text-lg font-bold font-heading">{entry.responses.sleep_hours}h</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Stress</p>
                      <p className="text-lg font-bold font-heading">{entry.responses.stress_level}/10</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Work</p>
                      <p className="text-lg font-bold font-heading">{entry.responses.work_hours || 8}h</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
