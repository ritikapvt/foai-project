import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, hasBaseline } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Brain, Activity } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    } else if (!hasBaseline()) {
      navigate("/baseline");
    }
  }, [navigate, user]);

  if (!user || !user.baseline) {
    return null;
  }

  const insights = [
    {
      icon: Brain,
      title: "Stress Level",
      value: `${user.baseline.baseline_stress}/10`,
      color: user.baseline.baseline_stress > 7 ? "text-danger" : user.baseline.baseline_stress > 4 ? "text-warn" : "text-good",
    },
    {
      icon: Activity,
      title: "Sleep",
      value: `${user.baseline.baseline_sleep_hours}h`,
      color: user.baseline.baseline_sleep_hours < 6 ? "text-warn" : "text-good",
    },
    {
      icon: TrendingUp,
      title: "Focus",
      value: `${user.baseline.baseline_focus}/5`,
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      title: "Activity",
      value: `${user.baseline.baseline_activity}min`,
      color: "text-good",
    },
  ];

  return (
    <div className="p-4 pb-20 md:pb-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1>Welcome back{user.name ? `, ${user.name}` : ""}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your wellness overview
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {insights.map((insight) => (
            <Card key={insight.title}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <insight.icon className={`h-8 w-8 ${insight.color}`} />
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Complete your daily check-in or explore wellness tips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/daily-checkin")}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Daily Check-in
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/learn")}
            >
              <Brain className="mr-2 h-5 w-5" />
              Learn & Explore
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Work Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.baseline.baseline_work_style}</p>
                <p className="text-sm text-muted-foreground">
                  {user.workMode.charAt(0).toUpperCase() + user.workMode.slice(1)} mode
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
