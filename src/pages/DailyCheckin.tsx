import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, addCheckInToHistory } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader2, Smile, Meh, Frown } from "lucide-react";
import { toast } from "sonner";
import { submitCheckIn } from "@/lib/checkInApi";
import { addToQueue, canCheckInToday, getLastCheckIn, saveLastCheckIn } from "@/lib/checkInQueue";
import { CheckInPayload } from "@/lib/checkInQueue";

export default function DailyCheckin() {
  const navigate = useNavigate();
  const user = getUser();
  const [useDemoApi, setUseDemoApi] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mood: 3,
    stress: 5,
    sleep_hours: 7,
    workload: "normal" as "light" | "normal" | "heavy",
    focus: 3,
    activity_minutes: 30,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
      return;
    }

    // Check if user can submit today
    const canCheck = canCheckInToday();
    setCanSubmit(canCheck);

    const last = getLastCheckIn();
    if (last) {
      setLastCheckInDate(last.date);
      if (!canCheck && last.data) {
        // Pre-fill with last entry for editing
        setFormData(last.data);
      }
    }
  }, [navigate, user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.sleep_hours < 0 || formData.sleep_hours > 24) {
      newErrors.sleep_hours = "Sleep hours must be between 0 and 24";
    }

    if (formData.activity_minutes < 0) {
      newErrors.activity_minutes = "Activity minutes cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check your responses");
      return;
    }

    if (!user) {
      toast.error("User not found");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const payload: CheckInPayload = {
      user_id: user.id,
      date: today,
      responses: formData,
      baseline: user.baseline || {},
    };

    setIsSubmitting(true);

    try {
      // Check if online
      if (!navigator.onLine) {
        addToQueue(payload);
        saveLastCheckIn(today, formData);
        toast.success("Saved offline — will send when back online");
        setIsSubmitting(false);
        return;
      }

      const result = await submitCheckIn(payload, useDemoApi);

      // Save result and last check-in
      saveLastCheckIn(today, formData);

      // Save to history
      addCheckInToHistory({
        date: payload.date,
        responses: formData,
        result,
      });

      // Navigate to result page with data
      navigate("/result", { state: { result, responses: formData } });
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof Error) {
        if (error.message === "RATE_LIMIT") {
          toast.error("Rate limit — try again in a few minutes");
        } else if (error.message.startsWith("VALIDATION:")) {
          toast.error(error.message.replace("VALIDATION: ", ""));
        } else {
          // Network error - save to queue
          addToQueue(payload);
          saveLastCheckIn(today, formData);
          toast.error("Network error — saved offline for retry");
        }
      }
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return <Frown className="h-8 w-8 text-danger" />;
    if (mood <= 3) return <Meh className="h-8 w-8 text-warn" />;
    return <Smile className="h-8 w-8 text-good" />;
  };

  const getNextAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString();
  };

  if (!user) return null;

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium text-center">
              Calculating your wellbeing snapshot…
            </p>
            <p className="text-sm text-muted-foreground mt-2">This takes just a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Last check-in info */}
        {lastCheckInDate && (
          <Card className="mb-4 bg-secondary/50 border-secondary">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Last check-in: <strong>{lastCheckInDate}</strong>
                </span>
                {!canSubmit && (
                  <span className="text-muted-foreground">
                    Next available: <strong>{getNextAvailableDate()}</strong>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <h1>Daily Check-In</h1>
          <p className="text-muted-foreground mt-1">
            Quick wellness snapshot — takes less than 60 seconds
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>How are you today?</CardTitle>
                <CardDescription>Answer honestly for better insights</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="demo-mode" className="text-xs text-muted-foreground">
                  Demo API
                </Label>
                <Switch
                  id="demo-mode"
                  checked={useDemoApi}
                  onCheckedChange={setUseDemoApi}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mood */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Mood right now</Label>
                  {getMoodEmoji(formData.mood)}
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.mood]}
                  onValueChange={(vals) => setFormData({ ...formData, mood: vals[0] })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>😞 Sad</span>
                  <span className="font-semibold text-primary">{formData.mood}</span>
                  <span>😊 Happy</span>
                </div>
              </div>

              {/* Stress */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Stress level</Label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.stress]}
                  onValueChange={(vals) => setFormData({ ...formData, stress: vals[0] })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very low</span>
                  <span className="font-semibold text-primary">{formData.stress}/10</span>
                  <span>Very high</span>
                </div>
              </div>

              {/* Sleep */}
              <div className="space-y-2">
                <Label htmlFor="sleep" className="text-base font-medium">
                  Last night's sleep (hours)
                </Label>
                <Input
                  id="sleep"
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={formData.sleep_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })
                  }
                  className={errors.sleep_hours ? "border-destructive" : ""}
                />
                {errors.sleep_hours && (
                  <p className="text-sm text-destructive">{errors.sleep_hours}</p>
                )}
              </div>

              {/* Workload */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Workload today</Label>
                <RadioGroup
                  value={formData.workload}
                  onValueChange={(value: "light" | "normal" | "heavy") =>
                    setFormData({ ...formData, workload: value })
                  }
                >
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="font-normal cursor-pointer">
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="font-normal cursor-pointer">
                      Normal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="heavy" id="heavy" />
                    <Label htmlFor="heavy" className="font-normal cursor-pointer">
                      Heavy
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Focus */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Focus today</Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.focus]}
                  onValueChange={(vals) => setFormData({ ...formData, focus: vals[0] })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Distracted</span>
                  <span className="font-semibold text-primary">{formData.focus}/5</span>
                  <span>Very focused</span>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <Label htmlFor="activity" className="text-base font-medium">
                  Active minutes today
                </Label>
                <Input
                  id="activity"
                  type="number"
                  min={0}
                  value={formData.activity_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_minutes: parseInt(e.target.value) || 0 })
                  }
                  className={errors.activity_minutes ? "border-destructive" : ""}
                />
                {errors.activity_minutes && (
                  <p className="text-sm text-destructive">{errors.activity_minutes}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Optional: anything you want to tell us?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Tip: try to answer honestly — it helps tailor tips.
                </p>
                <Button
                  type="submit"
                  className="w-full transition-all hover:scale-105"
                  disabled={!canSubmit && lastCheckInDate === new Date().toISOString().split("T")[0]}
                >
                  {!canSubmit && lastCheckInDate === new Date().toISOString().split("T")[0]
                    ? "Already submitted today"
                    : "Submit Check-In"}
                </Button>
                {!canSubmit && (
                  <p className="text-xs text-center text-muted-foreground">
                    You can edit today's entry or wait until tomorrow
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
