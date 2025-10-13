import { Leaf, LayoutDashboard, History, User, Lightbulb } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "History", path: "/my-tips", icon: History },
    { label: "Profile", path: "/settings", icon: User },
    { label: "Insights", path: "/learn", icon: Lightbulb },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => navigate("/")}
        >
          <Leaf className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-heading font-bold text-xl text-foreground">
            UnwindAI 🌿
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={isActive(item.path) ? "bg-primary hover:bg-primary/90" : ""}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Mobile: Just Profile Icon */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
