import type { ScheduledCourse } from "@/app/api/schedule/route";

interface Props {
  course: ScheduledCourse;
  actions?: React.ReactNode;
}

function formatTime(t: string) {
  if (!t || t === "00:00") return "";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

function modeLabel(mode: ScheduledCourse["mode"]) {
  if (mode === "online") return "Online";
  if (mode === "hybrid") return "Hybrid";
  return "In Person";
}

export function ScheduleCourseCard({ course, actions }: Props) {
  const hasSchedule = course.days.length > 0 && course.startTime !== "00:00";
  const daysStr = hasSchedule ? course.days.join("/") : null;
  const timeStr = hasSchedule
    ? `${formatTime(course.startTime)}–${formatTime(course.endTime)}`
    : null;

  return (
    <div className="bg-surface-page border border-border-default rounded-sm px-5 py-5 flex flex-col gap-3">

      {/* Row 1: code | units — both nowrap so they never break */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-brand whitespace-nowrap">{course.code}</span>
        <span className="text-sm text-text-secondary whitespace-nowrap flex-shrink-0">
          {course.units} {course.units === 1 ? "unit" : "units"}
        </span>
      </div>

      {/* Row 2: GE pill — its own row so long labels never squeeze row 1 */}
      {course.requirement && (
        <span className="text-xs text-text-secondary bg-surface-muted rounded-full px-2.5 py-1 self-start max-w-full truncate -mt-2">
          {course.requirement}
        </span>
      )}

      {/* Row 2–3: title + CRN */}
      <div className="flex flex-col gap-0.5">
        <p className="text-base font-semibold text-text-primary leading-snug">{course.title}</p>
        <p className="text-sm text-text-secondary">CRN {course.crn}</p>
      </div>

      {/* Row 4: instructor · schedule · location */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
        <span>{course.instructor}</span>
        {hasSchedule ? (
          <>
            <span>{daysStr} {timeStr}</span>
            <span>{modeLabel(course.mode)}: {course.location}</span>
          </>
        ) : (
          <span>Online / Async</span>
        )}
      </div>

      {/* Row 5: action buttons (optional) */}
      {actions && (
        <div className="flex items-center gap-3 pt-1">
          {actions}
        </div>
      )}
    </div>
  );
}
