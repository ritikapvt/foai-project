import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

export default function MyTips() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  const savedTips = user?.savedTips || [];

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

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1>My Saved Tips</h1>
          <p className="text-muted-foreground mt-1">
            Quick actions you can take anytime
          </p>
        </div>

        {savedTips.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                No saved tips yet. Save tips from your daily check-in results!
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/daily-checkin")}
              >
                Take a Check-in
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardDescription className="text-base text-foreground">
                        {tip}
                      </CardDescription>
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
            <div className="pt-4">
              <Badge variant="outline" className="text-xs">
                {savedTips.length} saved {savedTips.length === 1 ? "tip" : "tips"}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
