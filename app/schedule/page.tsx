"use client";

import { useState, useEffect, useCallback } from "react";
import { TopNav } from "@/components/TopNav";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";
import { ScheduleCourseCard } from "@/components/schedule/ScheduleCourseCard";
import { courses as allCourses } from "@/data/courses";
import type { ScheduleResponse, ApiMessage, ScheduledCourse } from "@/app/api/schedule/route";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "loading" | "saved" | "builder";
type BuilderStatus = "idle" | "loading" | "done" | "error";
type LoadingPhase = "working" | "finding";
type DisplayMessage =
  | { type: "user"; text: string }
  | { type: "assistant"; schedule: ScheduleResponse };

const SESSION_KEY = "pcc_saved_courses";
const SEMESTERS = ["Spring 2026", "Summer 2026", "Fall 2026"];
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236C6C6C' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`;

// ─── Small reusable button variants ──────────────────────────────────────────

const btnSecondary = "px-5 py-2.5 rounded-sm border border-border-default text-sm font-medium text-text-primary whitespace-nowrap hover:bg-surface-muted transition-colors focus-visible:outline-none";
const btnPrimary   = "px-5 py-2.5 rounded-sm bg-brand text-text-inverse text-sm font-medium whitespace-nowrap hover:bg-brand-hover transition-colors focus-visible:outline-none";
const btnSaved     = "px-5 py-2.5 rounded-sm bg-surface-muted text-sm font-medium text-text-secondary whitespace-nowrap flex items-center gap-2 cursor-default";

// ─── Seat badge ───────────────────────────────────────────────────────────────

function SeatsBadge({ seats, enrolled }: { seats: number; enrolled: number }) {
  const open = seats - enrolled;
  const pct  = enrolled / seats;
  if (open === 0)
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Full</span>;
  if (pct >= 0.8)
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{open} left</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-600 text-xs font-medium px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />{open} open</span>;
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  // View
  const [view, setView] = useState<View>("loading");

  // Saved courses (persisted in sessionStorage)
  const [savedCourses, setSavedCourses] = useState<ScheduledCourse[]>([]);

  // Registered CRNs (in-memory)
  const [registeredCrns, setRegisteredCrns] = useState<Set<string>>(new Set());

  // CRNs manually removed from the current AI schedule view
  const [removedScheduleCrns, setRemovedScheduleCrns] = useState<Set<string>>(new Set());

  // Toast
  const [toast, setToast] = useState<{ msg: string; key: number; exiting: boolean } | null>(null);

  // Builder
  const [semester, setSemester] = useState("Spring 2026");
  const [prompt, setPrompt] = useState("");
  const [builderStatus, setBuilderStatus] = useState<BuilderStatus>("idle");
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("working");
  const [errorMsg, setErrorMsg] = useState("");
  const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);

  // ── On mount: restore session ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const data = JSON.parse(raw) as ScheduledCourse[];
        setSavedCourses(data);
        setView(data.length > 0 ? "saved" : "builder");
      } else {
        setView("builder");
      }
    } catch {
      setView("builder");
    }
  }, []);

  // ── Loading phase cycle ────────────────────────────────────────────────────
  useEffect(() => {
    if (builderStatus !== "loading") return;
    setLoadingPhase("working");
    const t = setTimeout(() => setLoadingPhase("finding"), 2500);
    return () => clearTimeout(t);
  }, [builderStatus]);

  // ── Saved course helpers ───────────────────────────────────────────────────
  function persistSaved(next: ScheduledCourse[]) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSavedCourses(next);
  }

  const showToast = useCallback((msg: string) => {
    const key = Date.now();
    setToast({ msg, key, exiting: false });
    const exitT = setTimeout(() => setToast((prev) => prev?.key === key ? { ...prev, exiting: true } : prev), 2700);
    const clearT = setTimeout(() => setToast((prev) => prev?.key === key ? null : prev), 3000);
    return () => { clearTimeout(exitT); clearTimeout(clearT); };
  }, []);

  function saveCourse(course: ScheduledCourse) {
    if (!savedCourses.find((c) => c.crn === course.crn)) {
      persistSaved([...savedCourses, course]);
    }
    showToast(`${course.title} successfully saved`);
  }

  function removeSavedCourse(crn: string) {
    persistSaved(savedCourses.filter((c) => c.crn !== crn));
    setRegisteredCrns((prev) => { const n = new Set(prev); n.delete(crn); return n; });
  }

  function registerCourse(crn: string) {
    setRegisteredCrns((prev) => new Set([...prev, crn]));
  }

  function removeFromAISchedule(crn: string) {
    setRemovedScheduleCrns((prev) => new Set([...prev, crn]));
  }

  // ── Builder helpers ────────────────────────────────────────────────────────
  function startNewBuild() {
    setView("builder");
    setDisplayMessages([]);
    setApiHistory([]);
    setRemovedScheduleCrns(new Set());
    setBuilderStatus("idle");
    setPrompt("");
  }

  async function handleSend() {
    if (!prompt.trim()) return;
    const sent = prompt.trim();
    setPrompt("");
    setBuilderStatus("loading");
    setErrorMsg("");

    const newUserMsg: ApiMessage = { role: "user", content: sent };
    const nextHistory = [...apiHistory, newUserMsg];
    setApiHistory(nextHistory);
    setDisplayMessages((prev) => [...prev, { type: "user", text: sent }]);

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory, semester }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setBuilderStatus("error");
        return;
      }

      const raw =
        (data as ScheduleResponse & { _raw?: string })._raw ??
        JSON.stringify({ crns: data.courses.map((c: { crn: string }) => c.crn), reasoning: data.reasoning });

      setApiHistory((prev) => [...prev, { role: "assistant", content: raw }]);
      setDisplayMessages((prev) => [...prev, { type: "assistant", schedule: data }]);
      setBuilderStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error. Please try again.");
      setBuilderStatus("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const isIdle = builderStatus === "idle" && displayMessages.length === 0;
  const hasSchedule = displayMessages.some((m) => m.type === "assistant");
  const loadingText = loadingPhase === "working" ? "Working..." : "Finding your perfect schedule...";
  const lastAssistantIdx = displayMessages.reduce((last, msg, i) => (msg.type === "assistant" ? i : last), -1);

  // ── Toggle button (shared) ────────────────────────────────────────────────
  function ToggleButton() {
    if (view === "builder") {
      return (
        <button
          onClick={() => setView("saved")}
          className={btnSecondary + " flex items-center gap-1.5"}
        >
          Saved
          {savedCourses.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand text-text-inverse text-[10px] font-semibold flex items-center justify-center">
              {savedCourses.length}
            </span>
          )}
        </button>
      );
    }
    return (
      <button onClick={startNewBuild} className={btnSecondary + " flex items-center gap-1.5"}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1.5v4M6.5 7.5v.5M3.5 5l1.5 1.5M9.5 5l-1.5 1.5M3.5 8l1.5-1.5M9.5 8l-1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        LanceAI
      </button>
    );
  }

  // ── Render: loading ───────────────────────────────────────────────────────
  if (view === "loading") {
    return (
      <>
        <TopNav activeHref="/schedule" />
        <main className="min-h-[calc(100vh-4rem)]" />
      </>
    );
  }

  // ── Render: saved ─────────────────────────────────────────────────────────
  if (view === "saved") {
    const termForLookup = savedCourses[0]?.crn
      ? (allCourses.find((c) => c.crn === savedCourses[0].crn)?.term ?? "Spring 2026")
      : "Spring 2026";
    const termCatalog = allCourses.filter((c) => c.term === termForLookup);

    const daysOnCampus = [...new Set(savedCourses.flatMap((c) => c.days))].sort(
      (a, b) => ["Mon","Tue","Wed","Thu","Fri"].indexOf(a) - ["Mon","Tue","Wed","Thu","Fri"].indexOf(b)
    );
    const totalUnits = savedCourses.reduce((s, c) => s + c.units, 0);

    return (
      <>
        <TopNav activeHref="/schedule" />

        {/* Toast */}
        {toast && (
          <div
            key={toast.key}
            className="fixed top-4 left-1/2 z-50 flex items-center gap-2 bg-surface-page border border-border-default rounded-full px-5 py-2.5 shadow-md text-sm text-text-primary animate-[slideDown_0.2s_ease]"
          >
            <span className="text-green-600"><Check /></span>
            {toast.msg}
          </div>
        )}

        <main className="min-h-[calc(100vh-4rem)] bg-surface-subtle">

          {/* Sub-header */}
          <div className="bg-surface-page border-b border-border-default">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-medium">{termForLookup}</p>
                <h1 className="text-xl font-semibold text-text-primary leading-tight">Saved Schedule</h1>
              </div>
              <div className="flex items-center gap-3">
                <ToggleButton />
                <button className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border-default bg-surface-page text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 2h9a1 1 0 0 1 1 1v9.5l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M5 5.5h5M5 7.5h5M5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

            {savedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-base text-text-secondary">No courses saved yet.</p>
                <button onClick={startNewBuild} className={btnPrimary + " text-sm px-4 py-2"}>
                  Build a schedule with LanceAI
                </button>
              </div>
            ) : (
              <>
                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Units", value: String(totalUnits) },
                    { label: "Courses", value: String(savedCourses.length) },
                    { label: "Days on Campus", value: daysOnCampus.length > 0 ? daysOnCampus.join(" · ") : "Online only" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-page border border-border-default rounded-lg px-5 py-4">
                      <p className="text-xs text-text-secondary uppercase tracking-widest font-medium mb-1">{label}</p>
                      <p className="text-2xl font-semibold text-text-primary">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Calendar */}
                <section>
                  <h2 className="text-base font-medium text-text-primary mb-4">Weekly View</h2>
                  <ScheduleGrid courses={savedCourses} />
                </section>

                {/* Course cards */}
                <section>
                  <h2 className="text-base font-medium text-text-primary mb-4">Saved Courses</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCourses.map((course) => {
                      const catalog = termCatalog.find((c) => c.crn === course.crn);
                      const isRegistered = registeredCrns.has(course.crn);
                      return (
                        <div key={course.crn} className="relative">
                          {catalog && (
                            <div className="absolute top-4 right-5 z-10">
                              <SeatsBadge seats={catalog.seats} enrolled={catalog.enrolled} />
                            </div>
                          )}
                          <ScheduleCourseCard
                            course={course}
                            actions={
                              <>
                                <button
                                  onClick={() => removeSavedCourse(course.crn)}
                                  className={btnSecondary}
                                >
                                  Remove class
                                </button>
                                {isRegistered ? (
                                  <span className={btnSaved}>
                                    <Check /> Currently registered
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => registerCourse(course.crn)}
                                    className={btnPrimary}
                                  >
                                    Register for class
                                  </button>
                                )}
                              </>
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Register CTA */}
                <div className="bg-surface-page border border-border-default rounded-lg px-6 py-5 flex items-center justify-between gap-6">
                  <div>
                    <p className="text-base font-medium text-text-primary">Ready to register?</p>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Complete your enrollment through the PCC student portal before seats fill up.
                    </p>
                  </div>
                  <a
                    href="https://www.pasadena.edu/admissions/registration/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-5 py-2.5 rounded-sm bg-brand text-text-inverse text-sm font-medium hover:bg-brand-hover transition-colors"
                  >
                    Go to Portal
                  </a>
                </div>
              </>
            )}
          </div>
        </main>
      </>
    );
  }

  // ── Render: builder ───────────────────────────────────────────────────────
  return (
    <>
      <TopNav activeHref="/schedule" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div
            key={toast.key}
            className={`pointer-events-auto flex items-center gap-2 bg-surface-page border border-border-default rounded-full px-5 py-2.5 shadow-md text-sm text-text-primary ${toast.exiting ? "animate-[slideUp_0.3s_ease_forwards]" : "animate-[slideDown_0.3s_ease_forwards]"}`}
          >
            <span className="text-green-600"><Check /></span>
            {toast.msg}
          </div>
        </div>
      )}

      <main>

        {/* ── Idle hero ──────────────────────────────────────────────────── */}
        {isIdle && (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-semibold text-text-primary tracking-tight text-center mb-3">
              LanceAI Course Builder
            </h1>
            <p className="text-base text-text-secondary text-center mb-6 max-w-2xl">
              Tell us your availability, preferences, or paste your CRNs and we&apos;ll generate the best schedule for you.
            </p>

            <div className="mb-6 flex items-center gap-3">
              {savedCourses.length > 0 && (
                <button onClick={() => setView("saved")} className={btnSecondary}>
                  View saved ({savedCourses.length})
                </button>
              )}
              <div>
                <label htmlFor="semester-select-idle" className="sr-only">Semester</label>
                <select
                  id="semester-select-idle"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="rounded-full border border-border-default bg-surface-page px-5 py-2 text-base text-text-primary focus:outline-none appearance-none pr-10 cursor-pointer"
                  style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                >
                  {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="w-full max-w-2xl flex items-center rounded-full border border-border-default bg-surface-page shadow-sm overflow-hidden focus-within:border-brand transition-colors">
              <span className="pl-5 text-text-disabled flex-shrink-0" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <label htmlFor="schedule-prompt-idle" className="sr-only">Describe your ideal semester</label>
              <input
                id="schedule-prompt-idle"
                type="text"
                placeholder="Describe your availability, must-have classes, or paste CRNs"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent px-4 py-3.5 text-base text-text-primary placeholder:text-text-disabled focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!prompt.trim()}
                className="m-1.5 px-5 py-2 rounded-full bg-brand text-text-inverse text-base font-medium hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none flex-shrink-0"
              >
                Build schedule
              </button>
            </div>

            <p className="mt-3 text-sm text-text-secondary text-center">
              Include things like days off, work schedule, preferred times, or required classes
            </p>
          </div>
        )}

        {/* ── Chat ──────────────────────────────────────────────────────── */}
        {!isIdle && (
          <>
            {/* Sub-header */}
            <div className="border-b border-border-default">
              <div className="max-w-5xl mx-auto w-full px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                  LanceAI Course Builder
                </h1>
                <div className="flex items-center gap-3">
                  <ToggleButton />
                  <label htmlFor="semester-select-chat" className="sr-only">Semester</label>
                  <select
                    id="semester-select-chat"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="rounded border border-border-default bg-surface-page px-3 py-1.5 text-base text-text-primary focus:outline-none appearance-none pr-8 cursor-pointer"
                    style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Scrollable chat */}
            <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-28 flex flex-col gap-6">
              {displayMessages.map((msg, i) => {
                if (msg.type === "user") {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-3xl bg-[#fbfbfb] border border-[#cdcdcd] rounded-[6px] p-3 text-base text-text-primary leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const isLatest = i === lastAssistantIdx;
                const { schedule } = msg;

                // Conversational reply — no schedule to render
                if (schedule.type === "message") {
                  return (
                    <p key={i} className="text-base text-text-primary leading-relaxed animate-[fadeIn_0.3s_ease]">
                      {schedule.message}
                    </p>
                  );
                }

                const visibleCourses = schedule.courses.filter((c) => !removedScheduleCrns.has(c.crn));

                return (
                  <div key={i} className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease]">
                    <p className="text-base text-text-primary leading-relaxed">{schedule.reasoning}</p>

                    {isLatest && (
                      <>
                        <section>
                          <h2 className="text-base font-medium text-text-primary mb-4">Weekly View:</h2>
                          <ScheduleGrid courses={visibleCourses} />
                        </section>

                        <section>
                          <h2 className="text-base font-medium text-text-primary mb-4">Selected Courses:</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {visibleCourses.map((course) => {
                              const isSaved = savedCourses.some((c) => c.crn === course.crn);
                              return (
                                <ScheduleCourseCard
                                  key={course.crn}
                                  course={course}
                                  actions={
                                    <>
                                      <button
                                        onClick={() => removeFromAISchedule(course.crn)}
                                        className={btnSecondary}
                                      >
                                        Remove class
                                      </button>
                                      {isSaved ? (
                                        <span className={btnSaved}>
                                          <Check /> Currently saved
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => saveCourse(course)}
                                          className={btnPrimary}
                                        >
                                          Save class
                                        </button>
                                      )}
                                    </>
                                  }
                                />
                              );
                            })}
                          </div>
                        </section>

                        <div className="flex flex-col gap-4 pb-6">
                          <p className="text-base text-text-primary">
                            Would you like to save this course schedule? If you want to make any edits, just let me know!
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={startNewBuild}
                              className="px-6 py-3 rounded-sm border border-border-default bg-surface-subtle text-base font-medium text-text-primary hover:bg-surface-muted transition-colors focus-visible:outline-none"
                            >
                              Don&apos;t save
                            </button>
                            <button
                              onClick={() => {
                                visibleCourses.forEach((c) => {
                                  if (!savedCourses.find((s) => s.crn === c.crn)) {
                                    savedCourses.push(c);
                                  }
                                });
                                persistSaved([...savedCourses]);
                                setView("saved");
                              }}
                              className="px-6 py-3 rounded-sm bg-brand text-text-inverse text-base font-medium hover:bg-brand-hover transition-colors focus-visible:outline-none"
                            >
                              Save schedule
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {builderStatus === "loading" && (
                <p key={loadingText} className="text-base text-text-primary animate-[fadeIn_0.3s_ease]">
                  {loadingText}
                </p>
              )}
              {builderStatus === "error" && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}
            </div>

            {/* Fixed input bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-border-default bg-surface-page py-4 px-6 z-40">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center rounded-full border border-border-default bg-surface-page shadow-sm overflow-hidden focus-within:border-brand transition-colors">
                  <span className="pl-5 text-text-disabled flex-shrink-0" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <label htmlFor="schedule-prompt-chat" className="sr-only">Make edits or describe changes</label>
                  <input
                    id="schedule-prompt-chat"
                    type="text"
                    placeholder={hasSchedule ? "Ask for changes or describe edits…" : "Describe your availability, must-have classes, or paste CRNs"}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={builderStatus === "loading"}
                    className="flex-1 bg-transparent px-4 py-3.5 text-base text-text-primary placeholder:text-text-disabled focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!prompt.trim() || builderStatus === "loading"}
                    className="m-1.5 px-5 py-2 rounded-full bg-brand text-text-inverse text-base font-medium hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none flex-shrink-0"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
