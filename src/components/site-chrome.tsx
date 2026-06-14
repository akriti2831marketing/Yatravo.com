import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/passport", label: "Passport" },
    { to: "/tribe", label: "Tribe" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/vendors", label: "For Vendors" },
  ] as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-sand"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-xl text-ink tracking-tight">
          Stamped<span className="text-teal">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-ink/80 hover:text-teal transition-colors"
              activeProps={{ className: "text-sm font-medium text-teal" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/waitlist" className="pill-cta pill-primary text-sm hidden sm:inline-flex">
            Get early access
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-ink"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-sand bg-white">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-base text-ink">
                {l.label}
              </Link>
            ))}
            <Link to="/waitlist" onClick={() => setOpen(false)} className="pill-cta pill-primary text-sm self-start">
              Get early access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-canvas border-t border-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-sm">
            <div className="font-display font-semibold text-2xl">
              Stamped<span className="text-teal">.</span>
            </div>
            <p className="mt-3 text-sm text-mute">
              The travel passport for people who actually travel.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/80">
            <Link to="/passport" className="hover:text-teal">Passport</Link>
            <Link to="/tribe" className="hover:text-teal">Tribe</Link>
            <Link to="/marketplace" className="hover:text-teal">Marketplace</Link>
            <Link to="/vendors" className="hover:text-teal">For Vendors</Link>
            <a href="#" className="hover:text-teal">Privacy</a>
            <a href="#" className="hover:text-teal">Terms</a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-sand text-xs text-mute font-mono-accent">
          © 2026 Stamped. Built for travelers who actually travel.
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteNav />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
