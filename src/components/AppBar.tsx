import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppBarProps {
  pageTitle?: string;
  onProfileClick: () => void;
}

export function AppBar({ pageTitle = "WellCheck", onProfileClick }: AppBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">W</span>
          </div>
          <span className="hidden sm:inline-block text-sm font-semibold">WellCheck</span>
        </div>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
          {pageTitle}
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={onProfileClick}
          aria-label="Open profile"
          className="rounded-full"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
