import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles } from "lucide-react";
import { getUser, saveUser } from "@/lib/storage";
import { toast } from "sonner";

export const FutureSelfMessage = () => {
  const user = getUser();
  const [message, setMessage] = useState(user?.futureSelfMessage || "");
  const [isEditing, setIsEditing] = useState(!user?.futureSelfMessage);

  const handleSave = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      futureSelfMessage: message
    };

    saveUser(updatedUser);
    setIsEditing(false);
    toast.success("Message saved for your future self 💌");
  };

  return (
    <Card className="card-hover shadow-xl border-primary/20 bg-gradient-to-br from-lilac/10 via-cream/10 to-coral/10">
      <CardHeader>
        <CardTitle className="font-heading text-2xl flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Message to My Future Self
        </CardTitle>
        <p className="text-sm text-muted-foreground italic">
          A gentle reminder for when you need it most
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dear future me, remember how far you've come — you're stronger than that bad day..."
              className="min-h-[120px] border-primary/20 focus:border-primary bg-background/60 
                font-sans text-foreground resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Save Message
              </Button>
              {user?.futureSelfMessage && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMessage(user.futureSelfMessage || "");
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-6 bg-background/60 backdrop-blur-sm rounded-xl border-2 border-primary/10">
              <p className="text-foreground leading-relaxed italic font-medium">
                "{message}"
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              Edit Message
            </Button>
          </>
        )}

        {!isEditing && (
          <div className="p-4 bg-primary/5 rounded-lg animate-fade-in">
            <p className="text-xs text-muted-foreground">
              💡 This message will appear when your burnout rises — a gentle reminder of your resilience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
