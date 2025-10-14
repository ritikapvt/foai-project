import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Coffee, Moon, BookOpen, Footprints, Music, Flower2 } from "lucide-react";
import { getUser, saveUser } from "@/lib/storage";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  Coffee, Moon, BookOpen, Footprints, Music, Flower2
};

export const MyRitualsBoard = () => {
  const [user, setUser] = useState(getUser());
  const savedTips = user?.savedTips || [];

  const removeTip = (tip: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      savedTips: savedTips.filter((t) => t !== tip),
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    toast.success("Ritual removed");
  };

  const rituals = savedTips.map((tip, index) => ({
    tip,
    icon: Object.keys(iconMap)[index % Object.keys(iconMap).length],
    color: [
      "from-coral/20 to-coral/5",
      "from-mint/20 to-mint/5", 
      "from-lilac/20 to-lilac/5",
      "from-cream/20 to-cream/5"
    ][index % 4]
  }));

  if (rituals.length === 0) {
    return (
      <Card className="card-hover bg-gradient-to-br from-background to-primary/5">
        <div className="p-8 text-center space-y-3">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            No rituals saved yet. Start building your wellness habits on the dashboard!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
        <Flower2 className="h-5 w-5 text-primary" />
        My Wellness Rituals
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rituals.map((ritual, index) => {
          const Icon = iconMap[ritual.icon];
          
          return (
            <Card
              key={index}
              className={`card-hover border-none shadow-lg bg-gradient-to-br ${ritual.color}
                group transition-all duration-300 hover:scale-105`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-full bg-background/60">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTip(ritual.tip)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {ritual.tip}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
