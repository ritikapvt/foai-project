import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Trash2 } from "lucide-react";
import { getUser, saveUser } from "@/lib/storage";
import { toast } from "sonner";

export const TipLog = () => {
  const [user, setUser] = useState(getUser());
  const savedTips = user?.savedTips || [];
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const removeTip = (tip: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      savedTips: savedTips.filter((t) => t !== tip),
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    toast.success("Tip removed");
  };

  const rateTip = (tip: string, rating: number) => {
    setRatings(prev => ({ ...prev, [tip]: rating }));
    toast.success(`Rated ${rating} stars`);
  };

  if (savedTips.length === 0) {
    return (
      <Card className="card-hover">
        <CardContent className="pt-6 text-center py-8">
          <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            No saved tips yet. Save tips from the AI Coach on your dashboard!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl font-semibold mb-4">Saved Wellness Tips</h3>
      {savedTips.map((tip, index) => (
        <Card key={index} className="card-hover group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-foreground leading-relaxed">{tip}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => rateTip(tip, star)}
                        className="transition-colors hover:scale-110"
                      >
                        <Star 
                          className={`h-4 w-4 ${
                            (ratings[tip] || 0) >= star 
                              ? 'fill-primary text-primary' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Saved {Math.floor(Math.random() * 7) + 1} days ago
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTip(tip)}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
