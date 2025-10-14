import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Sun, Moon as MoonIcon, Calendar } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const Milestones = () => {
  const history = getCheckInHistory(30);
  
  const calmDays = history.filter(e => {
    const burnout = Math.min(100, Math.round(
      (e.responses.stress_level / 10) * 40 + 
      ((10 - e.responses.sleep_hours) / 10) * 30 + 
      ((e.responses.work_hours || 8) / 12) * 30
    ));
    return burnout < 40;
  }).length;

  const goodSleepDays = history.filter(e => e.responses.sleep_hours >= 7).length;

  const achievements = [
    {
      icon: Sun,
      title: `${calmDays} Calm Days`,
      subtitle: "This month",
      color: "from-good/30 to-good/10",
      iconColor: "text-good"
    },
    {
      icon: MoonIcon,
      title: `${goodSleepDays} Nights of Good Sleep`,
      subtitle: "7+ hours",
      color: "from-primary/30 to-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: Calendar,
      title: `${history.length} Days of Check-ins`,
      subtitle: "Building consistency",
      color: "from-secondary/30 to-secondary/10",
      iconColor: "text-secondary"
    },
    {
      icon: Trophy,
      title: "Wellness Warrior",
      subtitle: "Keep going strong!",
      color: "from-warn/30 to-warn/10",
      iconColor: "text-warn"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        Your Milestones & Achievements
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`card-hover border-none shadow-lg bg-gradient-to-br ${achievement.color}
              flex-shrink-0 w-64 transition-all duration-300 hover:scale-105`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-full bg-background/60 w-fit ${achievement.iconColor}`}>
                <achievement.icon className="h-8 w-8" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-heading text-xl font-bold text-foreground">
                  {achievement.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.subtitle}
                </p>
              </div>

              <Badge className="bg-background/80 text-foreground hover:bg-background/90">
                Achieved 🎉
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
