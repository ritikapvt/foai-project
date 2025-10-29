import { Card } from "@/components/ui/card";
import { getCheckInHistory } from "@/lib/storage";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const WeeklyInsights = () => {
  const history = getCheckInHistory();
  
  // Get last 7 days of data
  const weekData = history.slice(-7).map((entry) => {
    const date = new Date(entry.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    
    // Calculate burnout score (0-100)
    const stress = entry.responses.stress_level || 0;
    const sleep = entry.responses.sleep_hours || 7;
    const workHours = entry.responses.work_hours || 8;
    
    const sleepFactor = Math.max(0, (7 - sleep) / 7);
    const stressFactor = stress / 10;
    const workFactor = Math.max(0, (workHours - 8) / 8);
    
    const burnout = Math.round(((sleepFactor + stressFactor + workFactor) / 3) * 100);
    
    return {
      day: dayName,
      burnout: Math.min(100, Math.max(0, burnout)),
      date: entry.date,
    };
  });

  // Calculate average and trend
  const avgBurnout = weekData.length > 0
    ? Math.round(weekData.reduce((sum, d) => sum + d.burnout, 0) / weekData.length)
    : 0;

  const trend = weekData.length >= 2
    ? weekData[weekData.length - 1].burnout - weekData[0].burnout
    : 0;

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
  const trendColor = trend > 5 ? "text-coral" : trend < -5 ? "text-mint" : "text-muted-foreground";
  const trendText = trend > 5 ? "increasing" : trend < -5 ? "decreasing" : "stable";

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-lilac/5 to-mint/5 border-primary/20 shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Weekly Burnout Insights
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Your burnout scores over the past week
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{avgBurnout}%</div>
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="capitalize">{trendText}</span>
            </div>
          </div>
        </div>

        {weekData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--coral))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--coral))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="burnout"
                stroke="hsl(var(--coral))"
                strokeWidth={2}
                fill="url(#burnoutGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Complete more check-ins to see your weekly insights
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-mint">{weekData.filter(d => d.burnout < 33).length}</div>
            <div className="text-xs text-muted-foreground">Calm Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cream">{weekData.filter(d => d.burnout >= 33 && d.burnout < 66).length}</div>
            <div className="text-xs text-muted-foreground">Moderate Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-coral">{weekData.filter(d => d.burnout >= 66).length}</div>
            <div className="text-xs text-muted-foreground">High Days</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
