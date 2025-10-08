import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveUser, loadDemoUser } from "@/lib/storage";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "",
    workMode: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ageGroup) {
      newErrors.ageGroup = "Please select your age group";
    }

    if (!formData.consent) {
      newErrors.consent = "You must consent to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all required fields");
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      name: formData.name || undefined,
      ageGroup: formData.ageGroup,
      workMode: formData.workMode,
      consent: formData.consent,
    };

    saveUser(user);
    toast.success("Welcome to WellCheck!");
    navigate("/baseline");
  };

  const handleSkipDemo = () => {
    loadDemoUser();
    toast.success("Demo user loaded");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20 md:pb-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">W</span>
            </div>
          </div>
          <h1>Welcome to WellCheck</h1>
          <p className="text-muted-foreground">
            Quick check-ins for better work days
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
          <div className="space-y-2">
            <Label htmlFor="name">Your first name (optional)</Label>
            <Input
              id="name"
              placeholder="Your first name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageGroup">
              Age Group <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.ageGroup}
              onValueChange={(value) => {
                setFormData({ ...formData, ageGroup: value });
                setErrors({ ...errors, ageGroup: "" });
              }}
            >
              <SelectTrigger
                id="ageGroup"
                className={errors.ageGroup ? "border-destructive" : ""}
                aria-describedby={errors.ageGroup ? "ageGroup-error" : undefined}
              >
                <SelectValue placeholder="Select your age group" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="18-24">18–24</SelectItem>
                <SelectItem value="25-34">25–34</SelectItem>
                <SelectItem value="35-44">35–44</SelectItem>
                <SelectItem value="45+">45+</SelectItem>
              </SelectContent>
            </Select>
            {errors.ageGroup && (
              <p id="ageGroup-error" className="text-sm text-destructive" role="alert">
                {errors.ageGroup}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Work Mode</Label>
            <RadioGroup
              value={formData.workMode}
              onValueChange={(value) => setFormData({ ...formData, workMode: value })}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote" className="font-normal cursor-pointer">
                  Remote
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="font-normal cursor-pointer">
                  Hybrid
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="onsite" id="onsite" />
                <Label htmlFor="onsite" className="font-normal cursor-pointer">
                  Onsite
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, consent: checked as boolean });
                  setErrors({ ...errors, consent: "" });
                }}
                aria-describedby={errors.consent ? "consent-error" : "consent-help"}
                className={errors.consent ? "border-destructive" : ""}
              />
              <div className="space-y-1">
                <Label htmlFor="consent" className="font-normal cursor-pointer leading-tight">
                  I consent to anonymized collection of my responses for generating
                  personal wellness tips.{" "}
                  <a
                    href="/settings/privacy"
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Privacy policy coming soon");
                    }}
                  >
                    Read privacy policy
                  </a>
                </Label>
                <p id="consent-help" className="text-xs text-muted-foreground">
                  We only store anonymized metrics — you can opt-out anytime in Settings.
                </p>
              </div>
            </div>
            {errors.consent && (
              <p id="consent-error" className="text-sm text-destructive ml-7" role="alert">
                {errors.consent}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!formData.consent || !formData.ageGroup}
          >
            Continue
          </Button>

          <button
            type="button"
            onClick={handleSkipDemo}
            className="w-full text-sm text-muted-foreground hover:text-foreground underline"
          >
            Skip demo (load test user)
          </button>
        </form>
      </div>
    </div>
  );
}
