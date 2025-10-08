import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Heart, Zap } from "lucide-react";

export default function Learn() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  const resources = [
    {
      icon: Brain,
      title: "Stress Management",
      description: "Techniques to reduce workplace stress and anxiety",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Heart,
      title: "Sleep Hygiene",
      description: "Improve your sleep quality for better productivity",
      color: "text-good",
      bgColor: "bg-good/10",
    },
    {
      icon: Zap,
      title: "Energy & Focus",
      description: "Boost your concentration and mental clarity",
      color: "text-warn",
      bgColor: "bg-warn/10",
    },
    {
      icon: BookOpen,
      title: "Work-Life Balance",
      description: "Maintain healthy boundaries and prevent burnout",
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
  ];

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
          {resources.map((resource) => (
            <Card
              key={resource.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${resource.bgColor} mb-2`}>
                  <resource.icon className={`h-6 w-6 ${resource.color}`} />
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
