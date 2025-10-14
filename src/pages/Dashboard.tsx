import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, hasBaseline, getCheckInHistory } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Zap } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { WelcomeCard } from "@/components/WelcomeCard";
import { BurnoutForecastGraph } from "@/components/BurnoutForecastGraph";
import { AICoachTips } from "@/components/AICoachTips";
import { MoodCheckInWidget } from "@/components/MoodCheckInWidget";
import { GoalTracker } from "@/components/GoalTracker";
import { RelaxationZone } from "@/components/RelaxationZone";
import { StressProductivityChart } from "@/components/StressProductivityChart";
import { calculateInsights, getWeeklySummary } from "@/lib/insights";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

  const history = getCheckInHistory(28);
  const insights = calculateInsights(history);
  const weeklySummary = history.length >= 7 ? getWeeklySummary(history) : null;

  // Calculate burnout score (0-100) based on recent data
  const recentEntries = history.slice(0, 7);
  const avgStress = recentEntries.length > 0
    ? recentEntries.reduce((sum, e) => sum + e.responses.stress_level, 0) / recentEntries.length
    : 5;
  const avgSleep = recentEntries.length > 0
    ? recentEntries.reduce((sum, e) => sum + e.responses.sleep_hours, 0) / recentEntries.length
    : 7;
  const avgWorkHours = recentEntries.length > 0
    ? recentEntries.reduce((sum, e) => sum + (e.responses.work_hours || 8), 0) / recentEntries.length
    : 8;
  
  // Burnout formula: high stress + low sleep + long work hours = higher burnout
  const burnoutScore = Math.min(100, Math.round(
    (avgStress / 10) * 40 + 
    ((10 - avgSleep) / 10) * 30 + 
    (avgWorkHours / 12) * 30
  ));

  // Prepare chart data
  const chartData = history.map(entry => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: entry.responses.mood,
    stress: entry.responses.stress_level,
    sleep: entry.responses.sleep_hours,
    risk: entry.result?.risk === "Low" ? 1 : entry.result?.risk === "Medium" ? 2 : entry.result?.risk === "High" ? 3 : 0,
  }));


  const getChangeIcon = (change: number) => {
    if (Math.abs(change) < 2) return <Minus className="h-4 w-4" />;
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getChangeColor = (change: number, inverse = false) => {
    if (Math.abs(change) < 2) return "text-muted-foreground";
    const positive = inverse ? change < 0 : change > 0;
    return positive ? "text-good" : "text-danger";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* Welcome Card */}
        <WelcomeCard userName={user.name} />

        {/* Live Analytics Section */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Live Analytics
          </h2>
          
          <BurnoutForecastGraph />
          <StressProductivityChart />
        </div>

        {/* AI Coach Tips */}
        <AICoachTips />

        {/* Mood Check-In Widget */}
        <MoodCheckInWidget />

        {/* Goal Tracker */}
        <GoalTracker />

        {/* Relaxation Zone */}
        <RelaxationZone />

        {/* Charts Section */}
        {chartData.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold">Your Trends</h2>

            {/* Sleep Insights */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="font-heading">Sleep & Burnout Correlation</CardTitle>
                <CardDescription>See how your sleep impacts stress levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sleep"
                      stroke="hsl(var(--primary))"
                      fill="url(#sleepGradient)"
                      strokeWidth={3}
                      name="Sleep Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-good/10 rounded-xl">
                  <p className="text-sm text-foreground">
                    <strong className="text-good">Best range:</strong> 7-9 hours. Your average this week is {avgSleep.toFixed(1)}h.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workload Balance */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="font-heading">Workload Balance</CardTitle>
                <CardDescription>Work hours vs relaxation this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--good))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--good))", r: 4 }}
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(var(--danger))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--danger))", r: 4 }}
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-secondary/10 rounded-xl">
                  <p className="text-sm text-foreground">
                    Work dominated your week (70%). Try a digital detox this weekend.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weekly Summary Stats */}
        {weeklySummary && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="font-heading">This Week's Summary</CardTitle>
              <CardDescription>{weeklySummary.recommendation}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-good/5 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Avg Mood</p>
                  <p className="text-3xl font-bold font-heading">{weeklySummary.thisWeek.avgMood.toFixed(1)}</p>
                  <div className={`flex items-center justify-center gap-1 text-sm mt-1 ${getChangeColor(weeklySummary.changes.mood)}`}>
                    {getChangeIcon(weeklySummary.changes.mood)}
                    <span>{Math.abs(weeklySummary.changes.mood).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-danger/5 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Avg Stress</p>
                  <p className="text-3xl font-bold font-heading">{weeklySummary.thisWeek.avgStress.toFixed(1)}</p>
                  <div className={`flex items-center justify-center gap-1 text-sm mt-1 ${getChangeColor(weeklySummary.changes.stress, true)}`}>
                    {getChangeIcon(weeklySummary.changes.stress)}
                    <span>{Math.abs(weeklySummary.changes.stress).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Avg Sleep</p>
                  <p className="text-3xl font-bold font-heading">{weeklySummary.thisWeek.avgSleep.toFixed(1)}h</p>
                  <div className={`flex items-center justify-center gap-1 text-sm mt-1 ${getChangeColor(weeklySummary.changes.sleep)}`}>
                    {getChangeIcon(weeklySummary.changes.sleep)}
                    <span>{Math.abs(weeklySummary.changes.sleep).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-warn/5 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                  <Badge
                    className={`${
                      weeklySummary.thisWeek.avgRisk < 1.5
                        ? "bg-good text-white"
                        : weeklySummary.thisWeek.avgRisk < 2.5
                        ? "bg-warn"
                        : "bg-danger text-white"
                    } mt-2`}
                  >
                    {weeklySummary.thisWeek.avgRisk < 1.5 ? "Low" : weeklySummary.thisWeek.avgRisk < 2.5 ? "Medium" : "High"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Predictive Insights */}
        <Card className="card-hover border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg mb-2">Predictive Insights</h3>
                <p className="text-foreground/80 mb-3">
                  Your burnout may increase next week if sleep drops below 6h/night.
                </p>
                <div className="bg-good/10 rounded-xl p-3">
                  <p className="text-sm text-foreground">
                    <strong className="text-good">💡 Recommendation:</strong> Block 8 hours for sleep and set a bedtime alarm to maintain balance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">AI-Powered Insights</h2>
          
          {insights.length > 0 ? (
            <div className="grid gap-4">
              {insights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          ) : (
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Keep checking in for richer insights — you're at {history.length} days of data.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    We need at least 10 days of data to generate meaningful patterns.
                  </p>
                  <Button onClick={() => navigate("/daily-checkin")} className="bg-primary hover:bg-primary/90">
                    Check in now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
