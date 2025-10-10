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
import { Loader2 } from "lucide-react";
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
    work_hours: 8,
    sleep_hours: 7,
    sleep_quality: 5,
    stress_level: 5,
    mood: 5,
    workload: 5,
    focus: 5,
    activity_minutes: 30,
    connectedness: 5,
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

    if (!formData.work_hours && formData.work_hours !== 0) {
      newErrors.work_hours = "Required";
    }
    if (formData.work_hours < 0 || formData.work_hours > 24) {
      newErrors.work_hours = "Must be between 0 and 24";
    }

    if (!formData.sleep_hours && formData.sleep_hours !== 0) {
      newErrors.sleep_hours = "Required";
    }
    if (formData.sleep_hours < 0 || formData.sleep_hours > 24) {
      newErrors.sleep_hours = "Must be between 0 and 24";
    }

    if (!formData.activity_minutes && formData.activity_minutes !== 0) {
      newErrors.activity_minutes = "Required";
    }
    if (formData.activity_minutes < 0 || formData.activity_minutes > 300) {
      newErrors.activity_minutes = "Must be between 0 and 300";
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

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🧘 Daily Check-In</h1>
          <p className="text-muted-foreground">
            Quick 30-second reflection — answer honestly to get personalized tips.
          </p>
          <p className="text-sm text-muted-foreground mt-1">9 questions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Work Hours */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <Label htmlFor="work_hours" className="text-base font-medium">
                How many hours did you work today?
              </Label>
              <Input
                id="work_hours"
                type="number"
                min={0}
                max={24}
                step={0.5}
                placeholder="e.g., 9.5"
                value={formData.work_hours || ''}
                onChange={(e) =>
                  setFormData({ ...formData, work_hours: parseFloat(e.target.value) || 0 })
                }
                className={errors.work_hours ? "border-destructive" : ""}
              />
              {errors.work_hours && (
                <p className="text-sm text-destructive">{errors.work_hours}</p>
              )}
            </CardContent>
          </Card>

          {/* Sleep Hours */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <Label htmlFor="sleep_hours" className="text-base font-medium">
                How many hours did you sleep last night?
              </Label>
              <Input
                id="sleep_hours"
                type="number"
                min={0}
                max={24}
                step={0.5}
                placeholder="e.g., 6.0"
                value={formData.sleep_hours || ''}
                onChange={(e) =>
                  setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })
                }
                className={errors.sleep_hours ? "border-destructive" : ""}
              />
              {errors.sleep_hours && (
                <p className="text-sm text-destructive">{errors.sleep_hours}</p>
              )}
            </CardContent>
          </Card>

          {/* Sleep Quality */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How was your sleep quality?</Label>
                <span className="text-sm text-muted-foreground">1 = Poor, 10 = Excellent</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.sleep_quality]}
                onValueChange={(vals) => setFormData({ ...formData, sleep_quality: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span className="font-semibold text-primary text-base">{formData.sleep_quality}</span>
                <span>Excellent</span>
              </div>
            </CardContent>
          </Card>

          {/* Stress Level */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How stressed did you feel today?</Label>
                <span className="text-sm text-muted-foreground">1 = Calm, 10 = Very stressed</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.stress_level]}
                onValueChange={(vals) => setFormData({ ...formData, stress_level: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Calm</span>
                <span className="font-semibold text-primary text-base">{formData.stress_level}</span>
                <span>Very stressed</span>
              </div>
            </CardContent>
          </Card>

          {/* Mood */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How was your overall mood today?</Label>
                <span className="text-sm text-muted-foreground">1 = Low, 10 = Happy</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.mood]}
                onValueChange={(vals) => setFormData({ ...formData, mood: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span className="font-semibold text-primary text-base">{formData.mood}</span>
                <span>Happy</span>
              </div>
            </CardContent>
          </Card>

          {/* Workload */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How heavy was your workload today?</Label>
                <span className="text-sm text-muted-foreground">1 = Light, 10 = Overwhelming</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.workload]}
                onValueChange={(vals) => setFormData({ ...formData, workload: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Light</span>
                <span className="font-semibold text-primary text-base">{formData.workload}</span>
                <span>Overwhelming</span>
              </div>
            </CardContent>
          </Card>

          {/* Focus */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How focused were you during work?</Label>
                <span className="text-sm text-muted-foreground">1 = Unfocused, 10 = Highly focused</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.focus]}
                onValueChange={(vals) => setFormData({ ...formData, focus: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Unfocused</span>
                <span className="font-semibold text-primary text-base">{formData.focus}</span>
                <span>Highly focused</span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Minutes */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <Label htmlFor="activity_minutes" className="text-base font-medium">
                How many minutes did you move or exercise today?
              </Label>
              <Input
                id="activity_minutes"
                type="number"
                min={0}
                max={300}
                step={5}
                placeholder="e.g., 20"
                value={formData.activity_minutes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, activity_minutes: parseInt(e.target.value) || 0 })
                }
                className={errors.activity_minutes ? "border-destructive" : ""}
              />
              {errors.activity_minutes && (
                <p className="text-sm text-destructive">{errors.activity_minutes}</p>
              )}
            </CardContent>
          </Card>

          {/* Connectedness */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">How connected did you feel to others today?</Label>
                <span className="text-sm text-muted-foreground">1 = Isolated, 10 = Very connected</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.connectedness]}
                onValueChange={(vals) => setFormData({ ...formData, connectedness: vals[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Isolated</span>
                <span className="font-semibold text-primary text-base">{formData.connectedness}</span>
                <span>Very connected</span>
              </div>
            </CardContent>
          </Card>

          {/* Demo API Toggle */}
          <Card className="shadow-md bg-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="demo-mode" className="text-base font-medium">
                    Demo API Mode
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use mock predictions for testing
                  </p>
                </div>
                <Switch
                  id="demo-mode"
                  checked={useDemoApi}
                  onCheckedChange={setUseDemoApi}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button - Fixed at bottom */}
          <div className="sticky bottom-20 md:bottom-8 pt-4 pb-4 bg-background/95 backdrop-blur-sm">
            <Card className="shadow-lg border-primary/20">
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full text-lg py-6 transition-all hover:scale-105"
                  disabled={!canSubmit && lastCheckInDate === new Date().toISOString().split("T")[0]}
                >
                  {!canSubmit && lastCheckInDate === new Date().toISOString().split("T")[0]
                    ? "Already submitted today"
                    : "Submit Check-In"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Takes less than a minute ❤️
                </p>
                {!canSubmit && (
                  <p className="text-xs text-center text-muted-foreground">
                    You can edit today's entry or wait until tomorrow
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
