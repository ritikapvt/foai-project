import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const TrendCards = () => {
  const history = getCheckInHistory(28);

  const burnoutData = history.map(entry => ({
    value: Math.min(100, Math.round(
      (entry.responses.stress_level / 10) * 40 + 
      ((10 - entry.responses.sleep_hours) / 10) * 30 + 
      ((entry.responses.work_hours || 8) / 12) * 30
    ))
  })).reverse();

  const sleepData = history.map(entry => ({
    value: entry.responses.sleep_hours
  })).reverse();

  const avgBurnout = burnoutData.reduce((sum, d) => sum + d.value, 0) / Math.max(1, burnoutData.length);
  const avgSleep = sleepData.reduce((sum, d) => sum + d.value, 0) / Math.max(1, sleepData.length);

  const burnoutTrend = burnoutData.length >= 7 
    ? ((burnoutData[burnoutData.length - 1]?.value || 0) - (burnoutData[0]?.value || 0))
    : 0;

  const sleepTrend = sleepData.length >= 7
    ? ((sleepData[sleepData.length - 1]?.value || 0) - (sleepData[0]?.value || 0))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="font-heading text-base">Burnout Trend (4 weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-bold font-heading">{avgBurnout.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>
            <div className={`flex items-center gap-1 ${burnoutTrend < 0 ? 'text-good' : 'text-danger'}`}>
              {burnoutTrend < 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
              <span className="font-bold">{Math.abs(burnoutTrend).toFixed(0)}%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={burnoutData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--warn))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="font-heading text-base">Sleep Trend (4 weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-bold font-heading">{avgSleep.toFixed(1)}h</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>
            <div className={`flex items-center gap-1 ${sleepTrend > 0 ? 'text-good' : 'text-danger'}`}>
              {sleepTrend > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="font-bold">{Math.abs(sleepTrend).toFixed(1)}h</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sleepData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
