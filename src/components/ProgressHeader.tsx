import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  step: number;
  total: number;
}

export function ProgressHeader({ step, total }: ProgressHeaderProps) {
  const percentage = (step / total) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground">
          Step {step} of {total}
        </p>
        <p className="text-sm font-medium text-foreground">
          {Math.round(percentage)}%
        </p>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
