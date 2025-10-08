import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, clearUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Bell, HelpCircle } from "lucide-react";
import { QueueRetry } from "@/components/QueueRetry";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your account? This will delete all your data.")) {
      clearUser();
      toast.success("Account reset successfully");
      navigate("/onboarding");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1>Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-4">
          {/* Queue Retry Component */}
          <QueueRetry />

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{user.name || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Age Group</span>
                <span className="text-sm font-medium">{user.ageGroup}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Work Mode</span>
                <span className="text-sm font-medium capitalize">{user.workMode}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-good/10">
                  <Shield className="h-5 w-5 text-good" />
                </div>
                <div>
                  <CardTitle className="text-lg">Privacy</CardTitle>
                  <CardDescription>Data and consent settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Data consent</span>
                <span className="text-sm font-medium text-good">Active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warn/10">
                  <Bell className="h-5 w-5 text-warn" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <HelpCircle className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Help & Support</CardTitle>
                  <CardDescription>Get assistance</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleReset}
              >
                Reset Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
