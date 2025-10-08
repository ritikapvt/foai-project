import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueue, clearQueue } from "@/lib/checkInQueue";
import { submitCheckIn } from "@/lib/checkInApi";
import { toast } from "sonner";
import { CloudOff, RefreshCw } from "lucide-react";

export function QueueRetry() {
  const [isRetrying, setIsRetrying] = useState(false);
  const queue = getQueue();

  const handleRetry = async () => {
    if (!navigator.onLine) {
      toast.error("You're still offline. Please check your connection.");
      return;
    }

    setIsRetrying(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
      try {
        await submitCheckIn(item.payload, false);
        successCount++;
      } catch (error) {
        failCount++;
        console.error("Retry failed for item:", error);
        
        // Stop retrying on rate limit
        if (error instanceof Error && error.message === "RATE_LIMIT") {
          toast.error("Rate limit reached. Please try again later.");
          break;
        }
      }
    }

    setIsRetrying(false);

    if (successCount > 0) {
      clearQueue();
      toast.success(`${successCount} check-in(s) submitted successfully!`);
    }

    if (failCount > 0) {
      toast.error(`${failCount} check-in(s) failed to submit`);
    }
  };

  if (queue.length === 0) {
    return null;
  }

  return (
    <Card className="border-warn/50 bg-warn/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CloudOff className="h-5 w-5 text-warn" />
          <CardTitle className="text-lg">Pending Submissions</CardTitle>
        </div>
        <CardDescription>
          You have {queue.length} check-in{queue.length > 1 ? "s" : ""} waiting to be submitted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full"
          variant="outline"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Submissions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
