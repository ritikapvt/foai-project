import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Brain, Activity, Monitor } from "lucide-react";

const tips = [
  {
    category: "Mind Reset",
    icon: Brain,
    tip: "Try journaling for 5 minutes before bed to clear your mind.",
    color: "text-primary",
  },
  {
    category: "Physical Break",
    icon: Activity,
    tip: "Take a 15-minute walk this evening to reset your energy.",
    color: "text-secondary",
  },
  {
    category: "Work Strategy",
    icon: Monitor,
    tip: "Block focus time before noon when your energy is highest.",
    color: "text-accent",
  },
];

export const WellnessTipCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const currentTip = tips[currentIndex];
  const Icon = currentTip.icon;

  return (
    <Card className="card-hover bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${currentTip.color}`} />
            <h3 className="font-heading font-semibold">{currentTip.category}</h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTip}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{currentTip.tip}</p>
        <div className="flex justify-center gap-1.5 mt-4">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
