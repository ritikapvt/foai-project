import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const moods = [
  { emoji: "😢", label: "Very Low", value: 1 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

interface MoodSelectorProps {
  onMoodChange?: (mood: number) => void;
}

export const MoodSelector = ({ onMoodChange }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    onMoodChange?.(value);
  };

  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <h3 className="text-lg font-heading font-semibold mb-4">How are you feeling today?</h3>
        <div className="flex justify-between gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                selectedMood === mood.value
                  ? "bg-primary/10 border-2 border-primary scale-110"
                  : "bg-muted/30 border-2 border-transparent hover:scale-105"
              }`}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
