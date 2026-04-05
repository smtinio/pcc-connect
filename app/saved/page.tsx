import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";
import { ScheduleCourseCard } from "@/components/schedule/ScheduleCourseCard";
import { courses as allCourses } from "@/data/courses";
import type { ScheduledCourse } from "@/app/api/schedule/route";

interface PageProps {
  searchParams: Promise<{ crns?: string; semester?: string }>;
}

// Demo fallback — shown when navigating directly without params
const DEMO_CRNS = ["61001", "61011", "61030"];
const DEMO_SEMESTER = "Spring 2026";

function toScheduledCourse(c: (typeof allCourses)[number]): ScheduledCourse {
  return {
    crn: c.crn,
    code: c.code,
    title: c.title,
    instructor: c.instructor,
    units: c.units,
    days: c.days,
    startTime: c.startTime,
    endTime: c.endTime,
    location: c.location,
    mode: c.mode,
    requirement: c.requirement,
  };
}

function SeatsBadge({ seats, enrolled }: { seats: number; enrolled: number }) {
  const open = seats - enrolled;
  const pct = enrolled / seats;

  if (open === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-error-surface text-error text-xs font-medium px-2.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-error" />
        Full
      </span>
    );
  }
  if (pct >= 0.8) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-surface text-warning text-xs font-medium px-2.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
        {open} seat{open !== 1 ? "s" : ""} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-surface text-success text-xs font-medium px-2.5 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-success" />
      {open} open
    </span>
  );
}

export default async function SavedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const semester = params.semester ?? DEMO_SEMESTER;
  const crnList = params.crns ? params.crns.split(",") : DEMO_CRNS;

  const termCourses = allCourses.filter((c) => c.term === semester);
  const saved = crnList
    .map((crn) => termCourses.find((c) => c.crn === crn))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const scheduledCourses = saved.map(toScheduledCourse);
  const totalUnits = saved.reduce((s, c) => s + c.units, 0);

  const daysOnCampus = [
    ...new Set(saved.flatMap((c) => c.days)),
  ].sort((a, b) => {
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <>
      <TopNav />

      <main className="min-h-[calc(100vh-4rem)] bg-surface-subtle">

        {/* ── Sub-header ─────────────────────────────────────────────── */}
        <div className="bg-surface-page border-b border-border-default">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/schedule"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </Link>
              <div className="h-4 w-px bg-border-default" />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-medium">{semester}</p>
                <h1 className="text-xl font-semibold text-text-primary leading-tight">Saved Schedule</h1>
              </div>
            </div>

            <button
              onClick={undefined}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-default bg-surface-page text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3 2h9a1 1 0 0 1 1 1v9.5l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M5 5.5h5M5 7.5h5M5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Print
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

          {/* ── Stats strip ──────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Units", value: String(totalUnits) },
              { label: "Courses", value: String(saved.length) },
              {
                label: "Days on Campus",
                value: daysOnCampus.length > 0 ? daysOnCampus.join(" · ") : "Online only",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-surface-page border border-border-default rounded-lg px-5 py-4"
              >
                <p className="text-xs text-text-secondary uppercase tracking-widest font-medium mb-1">{label}</p>
                <p className="text-2xl font-semibold text-text-primary">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Weekly calendar ──────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-medium text-text-primary mb-4">Weekly View</h2>
            <ScheduleGrid courses={scheduledCourses} />
          </section>

          {/* ── Course list ──────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-medium text-text-primary mb-4">Enrolled Courses</h2>
            <div className="flex flex-col gap-3">
              {saved.map((course) => (
                <div key={course.crn} className="relative">
                  <ScheduleCourseCard course={toScheduledCourse(course)} />
                  {/* Seat availability overlaid on the card's top-right */}
                  <div className="absolute top-4 right-5">
                    <SeatsBadge seats={course.seats} enrolled={course.enrolled} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Register CTA ─────────────────────────────────────────── */}
          <div className="bg-surface-page border border-border-default rounded-lg px-6 py-5 flex items-center justify-between gap-6">
            <div>
              <p className="text-base font-medium text-text-primary">Ready to register?</p>
              <p className="text-sm text-text-secondary mt-0.5">
                Complete your enrollment through the PCC student portal. Make sure to register before seats fill up.
              </p>
            </div>
            <a
              href="https://www.pasadena.edu/admissions/registration/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-5 py-2.5 rounded-md bg-brand text-text-inverse text-sm font-medium hover:bg-brand-hover transition-colors"
            >
              Go to Portal
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
