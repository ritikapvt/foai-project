import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function DailyCheckin() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1>Daily Check-in</h1>
          <p className="text-muted-foreground mt-1">
            Track your wellness journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-good" />
            </div>
            <CardTitle className="text-center">Check-in Coming Soon</CardTitle>
            <CardDescription className="text-center">
              Daily wellness tracking will be available in the next update
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You'll be able to track your daily mood, energy, and stress levels here.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
