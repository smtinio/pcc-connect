import Link from "next/link";
import { PccShieldIcon } from "./icons/PccShieldIcon";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Schedule",  href: "/schedule" },
  { label: "Canvas",    href: "/canvas" },
  { label: "Email",     href: "/email" },
  { label: "Calendar",  href: "/calendar" },
];

interface TopNavProps {
  activeHref?: string;
}

export function TopNav({ activeHref = "/" }: TopNavProps) {
  return (
    <nav
      className="bg-surface-page border-b border-border-default h-16 flex items-center px-6 sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <PccShieldIcon className="h-7 w-auto flex-shrink-0" />
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            Connect
          </span>
        </Link>

        {/* Links + avatar */}
        <div className="flex items-center gap-6">
          {navLinks.map(({ label, href }) => {
            const active = activeHref === href;
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "text-base font-medium px-1 rounded-md transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  active
                    ? "text-brand"
                    : "text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}

          {/* User avatar */}
          <button
            aria-label="Open profile menu"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-border-default hover:border-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            {/* Placeholder avatar — swap for next/image + real user photo */}
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-surface-muted text-xs font-semibold text-text-secondary"
            >
              J
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
