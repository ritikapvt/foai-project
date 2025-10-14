import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const GoalTracker = () => {
  const history = getCheckInHistory(7);
  
  // Calculate weekly averages and goals
  const avgSleep = history.length > 0 
    ? history.reduce((sum, e) => sum + e.responses.sleep_hours, 0) / history.length 
    : 0;
  const sleepGoal = 7;
  const sleepProgress = Math.min(100, (avgSleep / sleepGoal) * 100);

  const avgActivity = history.length > 0 
    ? history.reduce((sum, e) => sum + (e.responses.activity_minutes || 0), 0) / history.length 
    : 0;
  const activityGoal = 30;
  const activityProgress = Math.min(100, (avgActivity / activityGoal) * 100);

  const daysWithBreaks = history.filter(e => 
    (e.responses.activity_minutes || 0) >= 15
  ).length;
  const breaksProgress = (daysWithBreaks / 7) * 100;

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="font-heading">Weekly Goal Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Sleep (7h target)</span>
            <span className="text-sm text-muted-foreground">{avgSleep.toFixed(1)}h avg</span>
          </div>
          <Progress value={sleepProgress} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Physical Activity (30min target)</span>
            <span className="text-sm text-muted-foreground">{avgActivity.toFixed(0)}min avg</span>
          </div>
          <Progress value={activityProgress} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Daily Breaks (5/7 days)</span>
            <span className="text-sm text-muted-foreground">{daysWithBreaks}/7 days</span>
          </div>
          <Progress value={breaksProgress} className="h-2" />
        </div>

        <div className="mt-4 p-3 bg-good/10 rounded-xl">
          <p className="text-sm text-foreground">
            {sleepProgress >= 100 && activityProgress >= 100 && breaksProgress >= 70
              ? "🎉 Amazing! You're crushing all your goals!"
              : sleepProgress >= 80 || activityProgress >= 80
              ? "💪 Great progress! Keep it up!"
              : "🌱 Small steps matter. You've got this!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
