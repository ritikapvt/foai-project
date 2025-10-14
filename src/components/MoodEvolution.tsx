import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCheckInHistory } from "@/lib/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export const MoodEvolution = () => {
  const history = getCheckInHistory(30);

  const data = history.slice(0, 14).reverse().map((entry) => {
    const burnout = Math.min(100, Math.round(
      (entry.responses.stress_level / 10) * 40 + 
      ((10 - entry.responses.sleep_hours) / 10) * 30 + 
      ((entry.responses.work_hours || 8) / 12) * 30
    ));

    return {
      date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      burnout: burnout,
      stress: entry.responses.stress_level * 10,
      calm: 100 - burnout
    };
  });

  return (
    <Card className="card-hover shadow-xl border-primary/10 bg-gradient-to-br from-background to-mint/5">
      <CardHeader>
        <CardTitle className="font-heading text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Emotional Growth Journey
        </CardTitle>
        <p className="text-sm text-muted-foreground italic">
          Scroll through your evolution — every wave tells a story
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="calmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--good))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--good))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="calm" 
              stroke="hsl(var(--good))" 
              fill="url(#calmGradient)"
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="burnout" 
              stroke="hsl(var(--danger))" 
              fill="url(#burnoutGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-good"></div>
            <span className="text-sm text-muted-foreground">Calm Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-danger"></div>
            <span className="text-sm text-muted-foreground">Burnout</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
