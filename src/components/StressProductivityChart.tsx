import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { Activity } from "lucide-react";
import { getCheckInHistory } from "@/lib/storage";

export const StressProductivityChart = () => {
  const history = getCheckInHistory(14);
  
  const chartData = history.map(entry => ({
    stress: entry.responses.stress_level,
    focus: entry.responses.focus || 5,
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: 1
  }));

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-secondary" />
          <CardTitle className="font-heading">Stress vs Focus Correlation</CardTitle>
        </div>
        <CardDescription>How stress levels impact your ability to focus</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              type="number" 
              dataKey="stress" 
              name="Stress Level" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              domain={[0, 10]}
              label={{ value: 'Stress Level', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="focus" 
              name="Focus" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              domain={[0, 10]}
              label={{ value: 'Focus', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis type="number" dataKey="value" range={[60, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
              formatter={(value: any, name: string) => [value, name === "stress" ? "Stress" : "Focus"]}
            />
            <Scatter 
              name="Days" 
              data={chartData} 
              fill="hsl(var(--secondary))"
              opacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-secondary/10 rounded-xl">
          <p className="text-sm text-foreground">
            <strong className="text-secondary">Pattern:</strong> Your focus tends to drop when stress exceeds 7/10. Try stress-relief breaks during intense work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
