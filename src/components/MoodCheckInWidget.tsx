import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCheckInHistory } from "@/lib/storage";

const moodOptions = [
  { emoji: "😊", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😣", label: "Low", value: 2 },
  { emoji: "😢", label: "Poor", value: 1 },
];

export const MoodCheckInWidget = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const handleSubmit = () => {
    if (selectedMood === null) return;
    
    // Generate insight based on historical data
    const history = getCheckInHistory(30);
    const goodDays = history.filter(entry => 
      entry.responses.mood >= 4 && entry.responses.sleep_hours >= 7
    ).length;
    const totalDays = history.length;
    
    setShowInsight(true);
    toast.success("Mood logged successfully!");
  };

  const history = getCheckInHistory(30);
  const avgSleepOnGoodDays = history
    .filter(e => e.responses.mood >= 4)
    .reduce((sum, e) => sum + e.responses.sleep_hours, 0) / 
    Math.max(1, history.filter(e => e.responses.mood >= 4).length);

  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <h3 className="text-lg font-heading font-semibold mb-4">How are you feeling right now?</h3>
        
        <div className="flex justify-between gap-2 mb-4">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                selectedMood === mood.value
                  ? "bg-primary/20 border-2 border-primary scale-110"
                  : "bg-muted/30 border-2 border-transparent hover:scale-105 hover:bg-muted/50"
              }`}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>

        {selectedMood !== null && !showInsight && (
          <Button 
            onClick={handleSubmit}
            className="w-full"
          >
            Submit
          </Button>
        )}

        {showInsight && (
          <div className="mt-4 p-4 bg-primary/10 rounded-xl animate-fade-in">
            <p className="text-sm text-foreground">
              <strong className="text-primary">💡 Insight:</strong> You've felt better on days with {avgSleepOnGoodDays.toFixed(1)}+ hours of sleep. 
              {avgSleepOnGoodDays >= 7 ? " Keep prioritizing rest!" : " Try increasing your sleep tonight."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
