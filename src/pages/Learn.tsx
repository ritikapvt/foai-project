import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, CheckCircle2 } from "lucide-react";
import { LEARNING_MODULES } from "@/lib/learningModules";
import { toast } from "sonner";

export default function Learn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  const isCompleted = (moduleId: string) => {
    return user?.learningCompleted?.some((item) => item.id === moduleId);
  };

  const markAsRead = (moduleId: string) => {
    if (!user) return;

    const completed = user.learningCompleted || [];
    if (completed.some((item) => item.id === moduleId)) {
      toast.info("Already marked as read");
      return;
    }

    const updatedUser = {
      ...user,
      learningCompleted: [...completed, { id: moduleId, timestamp: new Date().toISOString() }],
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    toast.success("Marked as read!");
  };

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1>Learn & Explore</h1>
          <p className="text-muted-foreground mt-1">
            Wellness resources tailored for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {LEARNING_MODULES.map((module) => {
            const completed = isCompleted(module.id);
            const Icon = module.type === 'article' ? BookOpen : Video;

            return (
              <Card
                key={module.id}
                className="hover:shadow-md transition-shadow relative"
              >
                {completed && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="h-5 w-5 text-good" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {module.duration}
                    </Badge>
                    {module.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant={completed ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => markAsRead(module.id)}
                  >
                    {completed ? "Read again" : "Mark as read"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
