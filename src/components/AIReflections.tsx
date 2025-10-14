import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const AIReflections = () => {
  const [expandedBubble, setExpandedBubble] = useState<number | null>(null);

  const reflections = [
    {
      message: "Remember this day? You felt your calmest after journaling.",
      date: "2 weeks ago",
      color: "from-mint/30 to-good/20"
    },
    {
      message: "You've come a long way — burnout dropped from 7 to 3 since June.",
      date: "Last month",
      color: "from-lilac/30 to-primary/20"
    },
    {
      message: "Your best sleep streak was 8 consecutive nights. You can do it again!",
      date: "3 weeks ago",
      color: "from-coral/30 to-secondary/20"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        AI Memory Bubbles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reflections.map((reflection, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-500 border-none shadow-lg
              bg-gradient-to-br ${reflection.color}
              ${expandedBubble === index ? 'scale-105 shadow-2xl ring-2 ring-primary/30' : 'scale-100'}
              card-hover`}
            onClick={() => setExpandedBubble(expandedBubble === index ? null : index)}
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-primary animate-pulse`}></div>
                <span className="text-xs text-muted-foreground font-medium">{reflection.date}</span>
              </div>
              
              <p className={`text-foreground font-medium transition-all duration-300
                ${expandedBubble === index ? 'text-base' : 'text-sm'}`}>
                {reflection.message}
              </p>

              {expandedBubble === index && (
                <div className="pt-2 border-t border-foreground/10 animate-fade-in">
                  <p className="text-xs text-muted-foreground italic">
                    "Keep building on this progress — every small win matters."
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
