import Link from "next/link";
import { MapPinIcon } from "../icons/MapPinIcon";
import { PersonIcon } from "../icons/PersonIcon";
import { VideoIcon } from "../icons/VideoIcon";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";

interface CalendarEvent {
  time: string;
  type: "Lecture" | "Meeting" | "Lab" | "Office Hours";
  courseCode: string;
  courseName: string;
  locationIcon: "pin" | "video";
  location: string;
  instructor: string;
  timeRange: string;
  actionLabel: string;
  actionHref: string;
}

const events: CalendarEvent[] = [
  {
    time: "8:45AM",
    type: "Lecture",
    courseCode: "BUS 009",
    courseName: "Introduction to Business",
    locationIcon: "pin",
    location: "ANNEX 05",
    instructor: "Daniel Raddon",
    timeRange: "8:45AM – 10:10AM",
    actionLabel: "Get Directions",
    actionHref: "#",
  },
  {
    time: "3:15PM",
    type: "Lecture",
    courseCode: "ACCT 001A",
    courseName: "Financial Accounting",
    locationIcon: "pin",
    location: "R 304",
    instructor: "Karen Harmon",
    timeRange: "3:15PM – 5:20PM",
    actionLabel: "Get Directions",
    actionHref: "#",
  },
  {
    time: "6:00PM",
    type: "Meeting",
    courseCode: "BUS 009",
    courseName: "Group Project Meeting",
    locationIcon: "video",
    location: "Online Zoom",
    instructor: "Chris Snyder, Viv Jones, and 3 more",
    timeRange: "6:00PM – 7:00PM",
    actionLabel: "Join Zoom",
    actionHref: "#",
  },
];

export function CalendarSection() {
  return (
    <section aria-labelledby="calendar-heading">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 id="calendar-heading" className="text-2xl font-semibold text-text-primary">
            Calendar
          </h2>
          <span className="text-base text-text-secondary">Wednesday, August 14</span>
        </div>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-base font-medium text-brand hover:text-brand-hover transition-colors rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          View Full Calendar
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Events */}
      <ul role="list" className="divide-y divide-border-default">
        {events.map((event, i) => (
          <li key={i} className="flex items-start gap-4 py-5">
            {/* Time + type */}
            <div className="w-20 flex-shrink-0">
              <p className="text-base font-semibold text-text-primary">{event.time}</p>
              <p className="text-sm text-text-secondary mt-0.5">{event.type}</p>
            </div>

            {/* Course info */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-text-primary">
                <span className="text-brand mr-1">{event.courseCode}</span>
                {event.courseName}
              </p>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-text-secondary">
                  {event.locationIcon === "pin" ? (
                    <MapPinIcon className="w-3.5 h-3.5" aria-label="Location" />
                  ) : (
                    <VideoIcon className="w-3.5 h-3.5" aria-label="Video call" />
                  )}
                  {event.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-text-secondary">
                  <PersonIcon className="w-3.5 h-3.5" aria-label="Instructor" />
                  {event.instructor}
                </span>
              </div>
            </div>

            {/* Time range + action */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-text-secondary">{event.timeRange}</p>
              <Link
                href={event.actionHref}
                className="inline-flex items-center gap-0.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors mt-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                {event.actionLabel}
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
