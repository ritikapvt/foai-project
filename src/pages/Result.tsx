import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, saveUser, addCheckInToHistory } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Lightbulb, HelpCircle, Share2, Download, Bell, Bookmark } from "lucide-react";
import { PredictionResponse } from "@/lib/checkInApi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { result, responses } = (location.state as { result: PredictionResponse; responses: any }) || {};
  
  const [showExplanation, setShowExplanation] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<string>("");

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

  const formatFeatureName = (feature: string) => {
    return feature
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getFactorExplanation = (feature: string) => {
    const explanations: Record<string, string> = {
      sleep_hours: "Sleep hours — lower sleep is associated with higher stress and reduced wellbeing.",
      stress: "Stress level — higher stress correlates with increased health risks.",
      activity_minutes: "Physical activity — more movement typically supports better mental health.",
      mood: "Mood — lower mood scores can indicate underlying wellbeing concerns.",
      focus: "Focus level — difficulty concentrating may signal fatigue or stress.",
      workload: "Workload — excessive workload is linked to burnout risk.",
    };
    return explanations[feature] || "This factor contributes to your overall wellbeing score.";
  };

  const saveTip = (tip: string) => {
    if (!user) return;
    const savedTips = user.savedTips || [];
    if (!savedTips.includes(tip)) {
      user.savedTips = [...savedTips, tip];
      saveUser(user);
      toast({
        title: "Tip saved",
        description: "You can view your saved tips in Settings.",
      });
    }
  };

  const openReminderModal = (tip: string) => {
    setSelectedTip(tip);
    setReminderModalOpen(true);
  };

  const setReminder = (hours: number) => {
    // For now, just show a toast. In a real app, this would schedule a notification
    toast({
      title: "Reminder set",
      description: `We'll remind you in ${hours} hour${hours > 1 ? 's' : ''}.`,
    });
    setReminderModalOpen(false);
  };

  const saveSnapshot = () => {
    if (!user) return;
    const history = user.history || [];
    user.history = [
      ...history,
      {
        date: new Date().toISOString(),
        result,
        responses,
      },
    ];
    saveUser(user);
    toast({
      title: "Snapshot saved",
      description: "Your wellbeing snapshot has been saved to your history.",
    });
  };

  const shareWithHR = () => {
    // In a real app, this would POST to /api/v1/share
    toast({
      title: "Shared successfully",
      description: "Your anonymized summary has been shared with your organization.",
    });
    setShareModalOpen(false);
  };

  const exportPDF = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Export coming soon",
      description: "PDF export functionality will be available soon.",
    });
  };

  const scorePercentage = Math.round(result.score * 100);
  const maxContribution = Math.max(...result.top_factors.map(f => f.contribution));

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center mb-6">
          <h1>Your Wellbeing Snapshot</h1>
          <p className="text-muted-foreground mt-1">Based on today's check-in and your baseline</p>
        </div>

        {/* Risk Assessment with Gauge */}
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
            <h2 className={`${getRiskColor(result.risk)} mt-2 mb-2`}>
              {result.risk} Risk
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {getRiskMessage(result.risk)}
            </p>
          </CardContent>
        </Card>

        {/* Top Contributing Factors as Chips */}
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
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                {result.top_factors.slice(0, 3).map((factor, index) => (
                  <Tooltip key={factor.feature}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border hover:border-primary/50 transition-colors">
                        <span className="text-sm font-medium">
                          {index + 1}. {formatFeatureName(factor.feature)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(factor.contribution * 100)}%
                        </span>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{getFactorExplanation(factor.feature)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            {/* Explainability Toggle */}
            <div className="flex items-center gap-2 mt-6 mb-4">
              <Switch
                id="show-explanation"
                checked={showExplanation}
                onCheckedChange={setShowExplanation}
              />
              <Label htmlFor="show-explanation" className="cursor-pointer">
                Show explanation
              </Label>
            </div>

            {showExplanation && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  {result.top_factors.map((factor) => (
                    <div key={factor.feature} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{formatFeatureName(factor.feature)}</span>
                        <span className="text-muted-foreground">
                          {Math.round(factor.contribution * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(factor.contribution / maxContribution) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.top_factors[0] && (
                    <>
                      Your {formatFeatureName(result.top_factors[0].feature).toLowerCase()} 
                      {responses && ` (${responses[result.top_factors[0].feature] || 'N/A'})`} contributed 
                      ~{Math.round(result.top_factors[0].contribution * 100)}% to your risk because this factor 
                      has been associated with changes in wellbeing for you.
                    </>
                  )}
                </p>
              </div>
            )}
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
              Small, quick things you can try now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(result.tips.length > 0 ? result.tips : [
                "Try a short walk outside",
                "Drink a glass of water",
                "Schedule a 5-minute break"
              ]).map((tip, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{tip}</p>
                      <p className="text-xs text-muted-foreground mt-1">5–10 min</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveTip(tip)}
                      className="flex-1"
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save tip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReminderModal(tip)}
                      className="flex-1"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Remind me
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={saveSnapshot}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save snapshot
          </Button>
          <Button variant="outline" onClick={() => setShareModalOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share with HR
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Share Consent Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share with HR</DialogTitle>
            <DialogDescription>
              Share anonymized summary (no name or identifying details) with your organization? 
              This helps HR tailor wellbeing resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={shareWithHR}>
              Allow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Modal */}
      <Dialog open={reminderModalOpen} onOpenChange={setReminderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Reminder</DialogTitle>
            <DialogDescription>
              When would you like to be reminded about this tip?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p className="text-sm text-muted-foreground mb-3">"{selectedTip}"</p>
            <div className="grid gap-2">
              <Button variant="outline" onClick={() => setReminder(1)}>In 1 hour</Button>
              <Button variant="outline" onClick={() => setReminder(3)}>In 3 hours</Button>
              <Button variant="outline" onClick={() => setReminder(24)}>Tomorrow</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
