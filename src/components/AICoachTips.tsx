import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Bookmark, ChevronRight } from "lucide-react";
import { getUser, saveUser } from "@/lib/storage";
import { toast } from "sonner";

const aiTips = [
  {
    category: "Mind Reset",
    icon: "🧠",
    tip: "Try journaling before bed to clear mental clutter and improve sleep quality.",
    color: "primary"
  },
  {
    category: "Physical Break",
    icon: "🏃",
    tip: "Take a 15-minute walk this evening to reduce stress hormones by up to 30%.",
    color: "secondary"
  },
  {
    category: "Work Strategy",
    icon: "💻",
    tip: "Block focused work time before noon when your cognitive energy peaks.",
    color: "good"
  },
  {
    category: "Sleep Hygiene",
    icon: "😴",
    tip: "Dim lights 1 hour before bed to boost melatonin production naturally.",
    color: "primary"
  },
  {
    category: "Social Connection",
    icon: "💬",
    tip: "Schedule a brief coffee chat with a colleague to boost connectedness.",
    color: "secondary"
  }
];

export const AICoachTips = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const currentTip = aiTips[currentIndex];

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % aiTips.length);
  };

  const saveTip = () => {
    const user = getUser();
    if (!user) return;

    const existingSavedTips = user.savedTips || [];
    if (existingSavedTips.includes(currentTip.tip)) {
      toast.info("Tip already saved");
      return;
    }

    const updatedUser = {
      ...user,
      savedTips: [...existingSavedTips, currentTip.tip]
    };

    saveUser(updatedUser);
    setSavedTips([...savedTips, currentTip.tip]);
    toast.success("Tip saved to History");
  };

  const markHelpful = () => {
    toast.success("Thanks for the feedback! 💚");
  };

  return (
    <Card className="card-hover bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="font-heading">Your AI Wellness Coach Says...</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge variant="outline" className="mb-2">
            {currentTip.icon} {currentTip.category}
          </Badge>
          
          <p className="text-lg text-foreground leading-relaxed">
            {currentTip.tip}
          </p>

          <div className="flex items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={saveTip}
              className="gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={markHelpful}
              className="gap-2"
            >
              <Heart className="h-4 w-4" />
              Mark as Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              className="ml-auto gap-1"
            >
              Next Tip
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
