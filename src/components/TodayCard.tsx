import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { canCheckInToday } from "@/lib/checkInQueue";

export function TodayCard() {
  const navigate = useNavigate();
  const user = getUser();
  const lastCheckIn = user?.history?.[0];
  const canCheckIn = canCheckInToday();

  const getRiskColor = (risk?: string) => {
    if (risk === "Low") return "bg-good text-white";
    if (risk === "Medium") return "bg-warn text-white";
    if (risk === "High") return "bg-danger text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Today's Status</h3>
            {lastCheckIn ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Last check-in: {new Date(lastCheckIn.date).toLocaleDateString()}
                </p>
                {lastCheckIn.result && (
                  <Badge className={getRiskColor(lastCheckIn.result.risk)}>
                    {lastCheckIn.result.risk} Risk
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No check-ins yet</p>
            )}
          </div>
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </div>

        <Button
          className="w-full"
          variant={canCheckIn ? "default" : "outline"}
          onClick={() => navigate(canCheckIn ? "/daily-checkin" : "/result")}
        >
          {canCheckIn ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Check in now
            </>
          ) : (
            "View today's result"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
