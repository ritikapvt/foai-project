import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, hasBaseline, getCheckInHistory } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { TodayCard } from "@/components/TodayCard";
import { StreakBadge } from "@/components/StreakBadge";
import { InsightCard } from "@/components/InsightCard";
import { TodayTipCard } from "@/components/TodayTipCard";
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
  const [useLocalInsights, setUseLocalInsights] = useState(user?.useLocalInsights ?? true);

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

  // Prepare chart data
  const chartData = history.map(entry => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: entry.responses.mood,
    stress: entry.responses.stress,
    sleep: entry.responses.sleep_hours,
    risk: entry.result?.risk === "Low" ? 1 : entry.result?.risk === "Medium" ? 2 : entry.result?.risk === "High" ? 3 : 0,
  }));

  const handleInsightsToggle = (checked: boolean) => {
    setUseLocalInsights(checked);
    if (user) {
      user.useLocalInsights = checked;
      const { saveUser } = require("@/lib/storage");
      saveUser(user);
    }
  };

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
    <div className="p-4 pb-20 md:pb-8 space-y-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your wellness overview</p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TodayCard />
          <StreakBadge />
          <TodayTipCard />
        </div>

        {/* Weekly Summary */}
        {weeklySummary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>This Week's Summary</CardTitle>
              <CardDescription>{weeklySummary.recommendation}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Mood</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{weeklySummary.thisWeek.avgMood.toFixed(1)}</p>
                    <div className={`flex items-center text-sm ${getChangeColor(weeklySummary.changes.mood)}`}>
                      {getChangeIcon(weeklySummary.changes.mood)}
                      <span>{Math.abs(weeklySummary.changes.mood).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Stress</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{weeklySummary.thisWeek.avgStress.toFixed(1)}</p>
                    <div className={`flex items-center text-sm ${getChangeColor(weeklySummary.changes.stress, true)}`}>
                      {getChangeIcon(weeklySummary.changes.stress)}
                      <span>{Math.abs(weeklySummary.changes.stress).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Sleep</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{weeklySummary.thisWeek.avgSleep.toFixed(1)}h</p>
                    <div className={`flex items-center text-sm ${getChangeColor(weeklySummary.changes.sleep)}`}>
                      {getChangeIcon(weeklySummary.changes.sleep)}
                      <span>{Math.abs(weeklySummary.changes.sleep).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        weeklySummary.thisWeek.avgRisk < 1.5
                          ? "bg-good text-white"
                          : weeklySummary.thisWeek.avgRisk < 2.5
                          ? "bg-warn text-white"
                          : "bg-danger text-white"
                      }
                    >
                      {weeklySummary.thisWeek.avgRisk < 1.5 ? "Low" : weeklySummary.thisWeek.avgRisk < 2.5 ? "Medium" : "High"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trends Section */}
        {chartData.length > 0 && (
          <div className="space-y-6 mb-6">
            <h2 className="text-xl font-semibold">Trends</h2>

            {/* Mood & Stress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Mood & Stress Over Time</CardTitle>
                <CardDescription>Last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--good))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--good))" }}
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(var(--danger))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--danger))" }}
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sleep Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sleep Hours</CardTitle>
                <CardDescription>Last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sleep"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                      name="Sleep Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Timeline</CardTitle>
                <CardDescription>Last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      domain={[0, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) => (value === 1 ? "Low" : value === 2 ? "Medium" : "High")}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        value === 1 ? "Low" : value === 2 ? "Medium" : value === 3 ? "High" : "N/A"
                      }
                    />
                    <Line
                      type="stepAfter"
                      dataKey="risk"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      name="Risk Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learning & Insights Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learning & Insights</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="local-insights" className="text-sm">
                Compute locally
              </Label>
              <Switch id="local-insights" checked={useLocalInsights} onCheckedChange={handleInsightsToggle} />
            </div>
          </div>

          {insights.length > 0 ? (
            <div className="grid gap-4">
              {insights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Keep checking in for richer insights — you're at {history.length} days of data.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    We need at least 10 days of data to generate meaningful correlations.
                  </p>
                  <Button onClick={() => navigate("/daily-checkin")}>
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
