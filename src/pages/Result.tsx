import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { PredictionResponse } from "@/lib/checkInApi";
import { BackButton } from "@/components/BackButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { result } = (location.state as { result: PredictionResponse; responses: any }) || {};

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    } else if (!result) {
      navigate("/daily-checkin");
    }
  }, [navigate, user, result]);

  if (!result) return null;

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return <CheckCircle className="h-16 w-16 text-good" />;
      case "Medium":
        return <AlertTriangle className="h-16 w-16 text-warn" />;
      case "High":
        return <AlertCircle className="h-16 w-16 text-danger" />;
      default:
        return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-good";
      case "Medium":
        return "text-warn";
      case "High":
        return "text-danger";
      default:
        return "text-foreground";
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-good/10 border-good/20";
      case "Medium":
        return "bg-warn/10 border-warn/20";
      case "High":
        return "bg-danger/10 border-danger/20";
      default:
        return "bg-secondary";
    }
  };

  const getRiskMessage = (risk: string) => {
    switch (risk) {
      case "Low":
        return "Low risk — you're doing well today.";
      case "Medium":
        return "Medium risk — a few small adjustments could help.";
      case "High":
        return "High risk — consider trying these steps and check in again tomorrow.";
      default:
        return "";
    }
  };

  const scorePercentage = Math.round(result.score * 100);

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <BackButton to="/dashboard" />
          <div className="mt-2">
            <Breadcrumbs />
          </div>
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Your Wellbeing Snapshot</h1>
            <p className="text-muted-foreground mt-1">Based on today's check-in</p>
          </div>

          {/* Burnout Score & Risk Range */}
          <Card className={`${getRiskBgColor(result.risk)} border-2 animate-scale-in`}>
            <CardContent className="flex flex-col items-center py-8">
              {/* Gauge Ring */}
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.score)}`}
                    className={getRiskColor(result.risk)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getRiskColor(result.risk)}`}>
                      {scorePercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {getRiskIcon(result.risk)}
              <h2 className={`text-3xl font-heading font-bold ${getRiskColor(result.risk)} mt-2 mb-2`}>
                {result.risk} Risk
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {getRiskMessage(result.risk)}
              </p>
            </CardContent>
          </Card>

          {/* Personalized Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Insights</CardTitle>
              </div>
              <CardDescription>
                Personalized recommendations for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(result.tips.length > 0 ? result.tips : [
                  "Try a short walk outside",
                  "Drink a glass of water",
                  "Schedule a 5-minute break"
                ]).map((tip, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
