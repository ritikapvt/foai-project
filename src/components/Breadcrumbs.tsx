import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs = () => {
  const location = useLocation();
  
  const pathMap: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/daily-checkin": "Daily Check-in",
    "/result": "Results",
    "/learn": "Insights",
    "/my-tips": "History",
    "/settings": "Profile",
    "/baseline": "Baseline Setup",
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    
    if (path === "/" || path === "/dashboard") {
      return [{ label: "Dashboard", path: "/dashboard" }];
    }

    return [
      { label: "Dashboard", path: "/dashboard" },
      { label: pathMap[path] || "Page", path },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-primary transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
