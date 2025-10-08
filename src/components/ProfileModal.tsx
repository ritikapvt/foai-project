import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUser, clearUser } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearUser();
    onOpenChange(false);
    navigate("/onboarding");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Your WellCheck account details</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.name || "Not set"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Age Group</p>
              <p className="text-sm text-muted-foreground">{user.ageGroup}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Work Mode</p>
              <p className="text-sm text-muted-foreground capitalize">{user.workMode}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">User ID</p>
              <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/settings");
                }}
              >
                Settings
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Reset Account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
