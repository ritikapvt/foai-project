import { Card, CardContent } from "@/components/ui/card";
import { Music, Wind } from "lucide-react";

const quotes = [
  "You're not behind in life. You're simply unwinding.",
  "Rest is not a luxury. It's a necessity.",
  "Your mental health is a priority, not an option.",
  "Small steps every day lead to big changes.",
  "Be gentle with yourself. You're doing the best you can."
];

export const RelaxationZone = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Card className="card-hover bg-gradient-to-br from-secondary/20 via-background to-primary/20 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full animate-pulse">
            <Wind className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg mb-3">Relaxation Zone</h3>
            
            <div className="mb-4">
              <p className="text-foreground/90 italic text-lg leading-relaxed">
                "{randomQuote}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="p-3 bg-background/80 backdrop-blur-sm rounded-xl hover:bg-background transition-all hover:scale-105 group">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary group-hover:animate-pulse" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Calming Sounds</p>
                    <p className="text-xs text-muted-foreground">Rain & Nature</p>
                  </div>
                </div>
              </button>

              <button className="p-3 bg-background/80 backdrop-blur-sm rounded-xl hover:bg-background transition-all hover:scale-105 group">
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-secondary group-hover:animate-pulse" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Breathe</p>
                    <p className="text-xs text-muted-foreground">2-min guided</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
