import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SurveyQuestionProps {
  id: string;
  label: string;
  type: "slider" | "options" | "numeric";
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
  error?: string;
}

export function SurveyQuestion({
  id,
  label,
  type,
  value,
  onChange,
  min = 1,
  max = 10,
  options = [],
  minLabel,
  maxLabel,
  error,
}: SurveyQuestionProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>

      {type === "slider" && (
        <div className="space-y-2">
          <Slider
            id={id}
            min={min}
            max={max}
            step={1}
            value={[typeof value === "number" ? value : min]}
            onValueChange={(vals) => onChange(vals[0])}
            className="w-full"
            aria-label={label}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{minLabel || min}</span>
            <span className="text-sm font-semibold text-primary">
              {typeof value === "number" ? value : min}
            </span>
            <span className="text-xs text-muted-foreground">{maxLabel || max}</span>
          </div>
        </div>
      )}

      {type === "numeric" && (
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full"
          aria-label={label}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      {type === "options" && (
        <RadioGroup
          value={String(value)}
          onValueChange={onChange}
          aria-label={label}
        >
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-3 py-2">
              <RadioGroupItem value={option} id={`${id}-${option}`} />
              <Label
                htmlFor={`${id}-${option}`}
                className="font-normal cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
