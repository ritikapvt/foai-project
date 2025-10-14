import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

interface WelcomeCardProps {
  userName?: string;
}

export const WelcomeCard = ({ userName = "there" }: WelcomeCardProps) => {
  const history = getCheckInHistory(1);
  const todayData = history[0];

  const burnoutScore = todayData ? Math.round(
    (todayData.responses.stress_level / 10) * 40 + 
    ((10 - todayData.responses.sleep_hours) / 10) * 30 + 
    ((todayData.responses.work_hours || 8) / 12) * 30
  ) : 0;

  const stressLevel = todayData?.responses.stress_level || 0;
  const sleepHours = todayData?.responses.sleep_hours || 0;

  return (
    <Card className="card-hover bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold mb-2">
              Hey {userName} 👋
            </h2>
            <p className="text-muted-foreground mb-4">Here's how you're doing today</p>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-background/60 backdrop-blur-sm rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Burnout</p>
                <p className="text-2xl font-bold font-heading text-warn">{burnoutScore}%</p>
              </div>
              <div className="text-center p-3 bg-background/60 backdrop-blur-sm rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Stress</p>
                <p className="text-2xl font-bold font-heading text-danger">{stressLevel}/10</p>
              </div>
              <div className="text-center p-3 bg-background/60 backdrop-blur-sm rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Sleep</p>
                <p className="text-2xl font-bold font-heading text-primary">{sleepHours}h</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
