import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb } from "lucide-react";
import { Insight } from "@/lib/insights";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getConfidenceColor = (confidence: string) => {
    if (confidence === "High") return "bg-good text-white";
    if (confidence === "Medium") return "bg-warn text-white";
    return "bg-muted text-muted-foreground";
  };

  const getAxisLabel = (variable: string) => {
    const labels: Record<string, string> = {
      sleep_hours: "Sleep Hours",
      stress: "Stress Level",
      activity_minutes: "Activity Minutes",
      mood: "Mood",
    };
    return labels[variable] || variable;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base mb-2">{insight.message}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getConfidenceColor(insight.confidence)}>
                  {insight.confidence} confidence
                </Badge>
                <span className="text-sm text-muted-foreground">
                  r = {insight.correlation.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {getAxisLabel(insight.variables[0])} vs {getAxisLabel(insight.variables[1])}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={getAxisLabel(insight.variables[0])}
                    label={{ value: getAxisLabel(insight.variables[0]), position: "insideBottom", offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={getAxisLabel(insight.variables[1])}
                    label={{ value: getAxisLabel(insight.variables[1]), angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-sm">
                            <p className="text-sm font-medium">{data.date}</p>
                            <p className="text-sm text-muted-foreground">
                              {getAxisLabel(insight.variables[0])}: {data.x}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getAxisLabel(insight.variables[1])}: {data.y}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={insight.dataPoints} fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Correlation coefficient: {insight.correlation.toFixed(2)}</p>
                <p>Data points: {insight.dataPoints.length}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
