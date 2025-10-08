import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { PredictionResponse } from "@/lib/checkInApi";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { result, responses } = (location.state as { result: PredictionResponse; responses: any }) || {};

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
        return <CheckCircle className="h-12 w-12 text-good" />;
      case "Medium":
        return <AlertTriangle className="h-12 w-12 text-warn" />;
      case "High":
        return <AlertCircle className="h-12 w-12 text-danger" />;
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
        return "bg-good/10";
      case "Medium":
        return "bg-warn/10";
      case "High":
        return "bg-danger/10";
      default:
        return "bg-secondary";
    }
  };

  const formatFeatureName = (feature: string) => {
    return feature
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center mb-6">
          <h1>Your Wellbeing Snapshot</h1>
          <p className="text-muted-foreground mt-1">Based on today's check-in</p>
        </div>

        {/* Risk Assessment */}
        <Card className={`${getRiskBgColor(result.risk)} border-2 animate-scale-in`}>
          <CardContent className="flex flex-col items-center py-8">
            {getRiskIcon(result.risk)}
            <h2 className={`${getRiskColor(result.risk)} mt-4 mb-2`}>
              {result.risk} Risk
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {result.risk === "Low" &&
                "You're doing great! Keep up your healthy habits."}
              {result.risk === "Medium" &&
                "Some areas need attention. Follow the tips below to improve."}
              {result.risk === "High" &&
                "Please prioritize your wellbeing. Consider these recommendations."}
            </p>
            <div className="w-full max-w-xs mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Confidence Score</span>
                <span className="font-semibold">{Math.round(result.score * 100)}%</span>
              </div>
              <Progress value={result.score * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Top Contributing Factors */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Key Factors</CardTitle>
            </div>
            <CardDescription>
              Main contributors to today's assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.top_factors.map((factor, index) => (
              <div key={factor.feature} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {index + 1}. {formatFeatureName(factor.feature)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(factor.contribution * 100)}%
                  </span>
                </div>
                <Progress value={factor.contribution * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personalized Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>Personalized Tips</CardTitle>
            </div>
            <CardDescription>
              Action items to improve your wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Your Responses Summary */}
        {responses && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Mood</p>
                  <p className="font-medium">{responses.mood}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stress</p>
                  <p className="font-medium">{responses.stress}/10</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sleep</p>
                  <p className="font-medium">{responses.sleep_hours}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Workload</p>
                  <p className="font-medium capitalize">{responses.workload}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Focus</p>
                  <p className="font-medium">{responses.focus}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Activity</p>
                  <p className="font-medium">{responses.activity_minutes} min</p>
                </div>
              </div>
              {responses.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-muted-foreground text-xs mb-1">Notes</p>
                  <p className="text-sm italic">"{responses.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate("/learn")}
          >
            Explore Resources
          </Button>
        </div>
      </div>
    </div>
  );
}
