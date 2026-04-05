import type { ScheduledCourse } from "@/app/api/schedule/route";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am – 8pm

function timeToDecimal(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function formatHour(h: number) {
  if (h === 12) return "12 PM";
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

// Pastel palette for course blocks (cycles through)
const COLORS = [
  "bg-brand-subtle border-brand/30 text-brand",
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-green-50 border-green-200 text-green-800",
  "bg-orange-50 border-orange-200 text-orange-800",
  "bg-purple-50 border-purple-200 text-purple-800",
];

const ROW_HEIGHT = 48; // px per hour
const GRID_START = 7;  // 7am

interface Props {
  courses: ScheduledCourse[];
}

export function ScheduleGrid({ courses }: Props) {
  const onlineCourses = courses.filter((c) => c.mode === "online" || c.days.length === 0);
  const inPersonCourses = courses.filter((c) => c.days.length > 0 && c.mode !== "online");

  return (
    <div className="rounded-lg border border-border-default overflow-hidden bg-surface-page">
      {/* Day header row */}
      <div className="grid border-b border-border-default" style={{ gridTemplateColumns: "56px repeat(5, 1fr)" }}>
        <div className="border-r border-border-default" />
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-text-secondary uppercase tracking-wide border-r border-border-default last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative" style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}>
        {/* Hour lines + labels */}
        {HOURS.map((h, idx) => (
          <div
            key={h}
            className="absolute left-0 right-0 flex"
            style={{ top: `${idx * ROW_HEIGHT}px`, height: `${ROW_HEIGHT}px` }}
          >
            <div className="w-14 flex-shrink-0 flex items-start justify-end pr-2 pt-1 border-r border-border-default">
              <span className="text-xs text-text-disabled">{formatHour(h)}</span>
            </div>
            <div className="flex-1 border-b border-border-default border-dashed opacity-40" />
          </div>
        ))}

        {/* Day column separators */}
        {DAYS.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-r border-border-default"
            style={{ left: `${56 + (i + 1) * (100 / 5)}%`, display: i === 4 ? "none" : "block" }}
          />
        ))}

        {/* Course blocks */}
        {inPersonCourses.map((course, courseIdx) => {
          const color = COLORS[courseIdx % COLORS.length];
          const startDecimal = timeToDecimal(course.startTime);
          const endDecimal = timeToDecimal(course.endTime);
          const topPct = (startDecimal - GRID_START) * ROW_HEIGHT;
          const heightPct = (endDecimal - startDecimal) * ROW_HEIGHT;

          return course.days.map((day) => {
            const dayIdx = DAYS.indexOf(day);
            if (dayIdx === -1) return null;
            const colWidth = 100 / 5;
            const leftPct = 56 / 10 + dayIdx * colWidth; // approximate offset

            return (
              <div
                key={`${course.crn}-${day}`}
                className={`absolute rounded-md border px-2 py-1 overflow-hidden ${color}`}
                style={{
                  top: `${topPct}px`,
                  height: `${heightPct - 2}px`,
                  left: `calc(56px + ${dayIdx} * ((100% - 56px) / 5) + 2px)`,
                  width: `calc((100% - 56px) / 5 - 4px)`,
                }}
                title={`${course.code} – ${course.title}`}
              >
                <p className="text-xs font-medium leading-tight truncate">{course.code}</p>
                <p className="text-xs leading-tight truncate opacity-75">{course.location}</p>
              </div>
            );
          });
        })}
      </div>

      {/* Online / async courses */}
      {onlineCourses.length > 0 && (
        <div className="border-t border-border-default px-4 py-3">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Online / Async</p>
          <div className="flex flex-wrap gap-2">
            {onlineCourses.map((c, i) => (
              <span
                key={c.crn}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${COLORS[i % COLORS.length]}`}
              >
                {c.code} – {c.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
