import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, clearUser, saveUser } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Shield, Bell, Download, Trash2, Code, Type, Edit } from "lucide-react";
import { QueueRetry } from "@/components/QueueRetry";
import { ProfileModal } from "@/components/ProfileModal";
import { BackButton } from "@/components/BackButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { exportDataAsCSV } from "@/lib/dataExport";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/onboarding");
    }
  }, [navigate, user]);

  const preferences = user?.preferences || {};

  const updatePreference = (key: string, value: any) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      preferences: { ...preferences, [key]: value },
    };
    saveUser(updatedUser);
    setUser(updatedUser);
    toast.success("Preference updated");
  };

  const handleExportData = () => {
    exportDataAsCSV();
    toast.success("Data exported successfully");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    clearUser();
    setShowDeleteDialog(false);
    toast.success("Account deleted successfully");
    navigate("/onboarding");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 pb-20 md:pb-8 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackButton to="/dashboard" />
          <div className="mt-2">
            <Breadcrumbs />
          </div>
        </div>

        <div className="mb-6 animate-fade-in">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Profile & Settings</h1>
          <p className="text-foreground/80 mt-1 text-lg">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-4">
          {/* Queue Retry Component */}
          <QueueRetry />

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
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

          {/* Privacy & Data Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-good/10">
                  <Shield className="h-5 w-5 text-good" />
                </div>
                <div>
                  <CardTitle className="text-lg">Privacy & Data</CardTitle>
                  <CardDescription>Control your data and insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="server-analytics">Server-side analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Share anonymized data for better insights
                  </p>
                </div>
                <Switch
                  id="server-analytics"
                  checked={preferences.serverAnalytics || false}
                  onCheckedChange={(checked) => updatePreference("serverAnalytics", checked)}
                />
              </div>
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warn/10">
                  <Bell className="h-5 w-5 text-warn" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for daily check-ins
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notifications || false}
                  onCheckedChange={(checked) => updatePreference("notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Type className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Accessibility</CardTitle>
                  <CardDescription>Customize your viewing experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font size</Label>
                <Select
                  value={preferences.fontSize || "medium"}
                  onValueChange={(value) => updatePreference("fontSize", value)}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Developer Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Code className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Developer</CardTitle>
                  <CardDescription>Testing and development options</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="demo-mode">Demo API mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use mock responses for testing
                  </p>
                </div>
                <Switch
                  id="demo-mode"
                  checked={preferences.demoMode || false}
                  onCheckedChange={(checked) => updatePreference("demoMode", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This will delete all local and server data associated with your account. This
                action cannot be undone.
              </p>
              <p className="font-medium">Type DELETE to confirm:</p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
