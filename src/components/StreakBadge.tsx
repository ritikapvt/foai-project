import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flame, Award } from "lucide-react";
import { getUser } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";

export function StreakBadge() {
  const user = getUser();
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;

  const earned7Day = currentStreak >= 7;
  const earned30Day = currentStreak >= 30;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-danger" />
              <h3 className="text-lg font-semibold">Check-in Streak</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-1">{currentStreak} days</p>
            {currentStreak >= 7 && (
              <p className="text-sm font-medium text-good">{currentStreak} days strong! 🎉</p>
            )}
            {currentStreak === 0 && (
              <p className="text-sm text-muted-foreground">Start your streak today!</p>
            )}
            {currentStreak > 0 && currentStreak < 7 && (
              <p className="text-sm text-muted-foreground">
                Keep going! {7 - currentStreak} more to reach 7 days
              </p>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Award className="mr-2 h-4 w-4" />
              View Achievements
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Streak Achievements</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${earned7Day ? "bg-good/20" : "bg-muted"}`}>
                  <Flame className={`h-6 w-6 ${earned7Day ? "text-good" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">7-Day Streak</p>
                    {earned7Day && <Badge className="bg-good text-white">Earned</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Check in for 7 consecutive days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${earned30Day ? "bg-good/20" : "bg-muted"}`}>
                  <Award className={`h-6 w-6 ${earned30Day ? "text-good" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">30-Day Streak</p>
                    {earned30Day && <Badge className="bg-good text-white">Earned</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Check in for 30 consecutive days
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Stats</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Streak</p>
                    <p className="text-lg font-semibold">{currentStreak} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Longest Streak</p>
                    <p className="text-lg font-semibold">{longestStreak} days</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
