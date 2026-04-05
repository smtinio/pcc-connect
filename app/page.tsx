import { TopNav } from "@/components/TopNav";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { SearchIcon } from "@/components/icons/SearchIcon";

export default function DashboardPage() {
  return (
    <>
      <TopNav />

      <main className="max-w-7xl mx-auto px-6 py-8 w-full">

        {/* ── Welcome Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">
              Fall Semester, Week 3
            </p>
            <h1 className="text-3xl font-semibold text-text-primary tracking-tight">
              Good Morning, Jasmine
            </h1>
            <p className="text-lg text-text-secondary mt-1">
              How will you break barriers?
            </p>
          </div>

          {/* Search */}
          <div className="w-72 mt-1 flex-shrink-0">
            <label htmlFor="site-search" className="sr-only">Search</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-disabled">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                id="site-search"
                type="search"
                placeholder="Search"
                className="w-full rounded-md border border-border-default bg-surface-page pl-9 pr-3 py-2 text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus transition"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border-default mb-8" />

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <CalendarSection />
          <QuickLinks />
        </div>

      </main>
    </>
  );
}
