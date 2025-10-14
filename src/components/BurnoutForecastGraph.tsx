import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const BurnoutForecastGraph = () => {
  const history = getCheckInHistory(7);
  
  // Calculate historical burnout scores
  const historicalData = history.map((entry, index) => {
    const burnout = Math.min(100, Math.round(
      (entry.responses.stress_level / 10) * 40 + 
      ((10 - entry.responses.sleep_hours) / 10) * 30 + 
      ((entry.responses.work_hours || 8) / 12) * 30
    ));
    return {
      date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      burnout,
      type: "actual"
    };
  }).reverse();

  // Simple prediction: if stress is increasing, predict higher burnout
  const lastBurnout = historicalData[historicalData.length - 1]?.burnout || 50;
  const trend = history.length >= 2 ? 
    (history[0].responses.stress_level - history[1].responses.stress_level) * 5 : 0;

  const predictions = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    burnout: Math.max(0, Math.min(100, lastBurnout + trend * (i + 1))),
    type: "predicted"
  }));

  const chartData = [...historicalData, ...predictions];

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="font-heading">7-Day Burnout Forecast</CardTitle>
        </div>
        <CardDescription>Predicted burnout levels based on your recent patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warn))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--warn))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="burnout"
              stroke="hsl(var(--warn))"
              fill="url(#burnoutGradient)"
              strokeWidth={3}
              name="Burnout %"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-warn/10 rounded-xl">
          <p className="text-sm text-foreground">
            <strong className="text-warn">Forecast:</strong> Based on current trends, maintain 7+ hours of sleep to prevent burnout spikes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
