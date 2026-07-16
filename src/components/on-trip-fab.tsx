import { Link, useRouterState } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function OnTripFab() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  if (pathname.startsWith("/assistant") || pathname.startsWith("/auth")) return null;
  return (
    <Link
      to="/assistant"
      className="fixed z-40 bottom-5 left-5 md:bottom-8 md:left-8 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-teal text-white shadow-xl hover:bg-teal/90 transition-all font-medium text-sm"
      aria-label="Open travel assistant"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
        <Compass className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ember animate-pulse" />
      </span>
      On a trip?
    </Link>
  );
}
