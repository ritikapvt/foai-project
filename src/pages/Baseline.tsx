import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "@/components/ProgressHeader";
import { SurveyQuestion } from "@/components/SurveyQuestion";
import { getUser, saveUser, isOnboarded } from "@/lib/storage";
import { toast } from "sonner";

interface BaselineData {
  baseline_stress: number;
  baseline_sleep_hours: number;
  baseline_focus: number;
  baseline_activity: number;
  baseline_work_style: string;
}

const TOTAL_STEPS = 5;

export default function Baseline() {
  const navigate = useNavigate();
  const [currentStep] = useState(TOTAL_STEPS);
  const [formData, setFormData] = useState<BaselineData>({
    baseline_stress: 5,
    baseline_sleep_hours: 7,
    baseline_focus: 3,
    baseline_activity: 30,
    baseline_work_style: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOnboarded()) {
      navigate("/onboarding");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.baseline_sleep_hours < 0 || formData.baseline_sleep_hours > 24) {
      newErrors.baseline_sleep_hours = "Sleep hours must be between 0 and 24";
    }

    if (formData.baseline_activity < 0) {
      newErrors.baseline_activity = "Activity minutes cannot be negative";
    }

    if (!formData.baseline_work_style) {
      newErrors.baseline_work_style = "Please select your work style";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check your responses");
      return;
    }

    const user = getUser();
    if (user) {
      saveUser({ ...user, baseline: formData });
      toast.success("Baseline saved! Let's get started.");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2">Set Your Baseline</h1>
          <p className="text-muted-foreground">
            This helps us personalize your tips — it takes only a minute.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <ProgressHeader step={currentStep} total={TOTAL_STEPS} />

          <form onSubmit={handleSubmit} className="space-y-8">
            <SurveyQuestion
              id="baseline_stress"
              label="Typical stress level"
              type="slider"
              min={1}
              max={10}
              minLabel="Very low"
              maxLabel="Very high"
              value={formData.baseline_stress}
              onChange={(value) =>
                setFormData({ ...formData, baseline_stress: value as number })
              }
            />

            <SurveyQuestion
              id="baseline_sleep_hours"
              label="Typical sleep per night (hours)"
              type="numeric"
              min={0}
              max={24}
              value={formData.baseline_sleep_hours}
              onChange={(value) =>
                setFormData({ ...formData, baseline_sleep_hours: value as number })
              }
              error={errors.baseline_sleep_hours}
            />

            <SurveyQuestion
              id="baseline_focus"
              label="How focused are you during work?"
              type="slider"
              min={1}
              max={5}
              minLabel="Distracted"
              maxLabel="Very focused"
              value={formData.baseline_focus}
              onChange={(value) =>
                setFormData({ ...formData, baseline_focus: value as number })
              }
            />

            <SurveyQuestion
              id="baseline_activity"
              label="Active minutes per day"
              type="numeric"
              min={0}
              max={1440}
              value={formData.baseline_activity}
              onChange={(value) =>
                setFormData({ ...formData, baseline_activity: value as number })
              }
              error={errors.baseline_activity}
            />

            <SurveyQuestion
              id="baseline_work_style"
              label="What's your typical work style?"
              type="options"
              options={["Deep work", "Interrupted", "Mixed"]}
              value={formData.baseline_work_style}
              onChange={(value) =>
                setFormData({ ...formData, baseline_work_style: value as string })
              }
              error={errors.baseline_work_style}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Save baseline & go to Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
