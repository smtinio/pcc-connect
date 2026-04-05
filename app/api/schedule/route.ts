import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";

const client = new Anthropic();

export interface ScheduledCourse {
  crn: string;
  code: string;
  title: string;
  instructor: string;
  units: number;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  mode: "in-person" | "online" | "hybrid";
  requirement?: string;
}

export interface ScheduleResponse {
  type: "schedule" | "message";
  courses: ScheduledCourse[];
  totalUnits: number;
  reasoning: string;
  message?: string; // set when type === "message"
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages, semester } = await req.json() as {
    messages: ApiMessage[];
    semester?: string;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const term = semester ?? "Spring 2026";
  const termCourses = courses.filter((c) => c.term === term);

  // Convert "HH:MM" → minutes from midnight (used in catalog and overlap guard)
  function toMin(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  // Compact catalog: drop zero-seat sections and only keep fields the AI needs.
  // Times are expressed as integer minutes so the AI can do overlap math easily.
  const catalogSummary = termCourses
    .filter((c) => c.seats - c.enrolled > 0)
    .map((c) => ({
      crn: c.crn,
      code: c.code,
      title: c.title,
      u: c.units,
      days: c.days.length > 0 ? c.days.join("/") : "async",
      // startMin/endMin: minutes from midnight — 540 = 9:00 AM, 650 = 10:50 AM
      startMin: c.startTime !== "00:00" ? toMin(c.startTime) : null,
      endMin:   c.endTime   !== "00:00" ? toMin(c.endTime)   : null,
      mode: c.mode[0],
      req: c.requirement ?? "",
    }));

  const systemPrompt = `You are an academic advisor AI for Pasadena City College (PCC).
Build or edit a personalized schedule for ${term} based on the conversation so far.

The course catalog for ${term} is:
${JSON.stringify(catalogSummary)}

Rules:
- Only use CRNs from the catalog above.
- OVERLAP CHECK (mandatory): Two courses conflict if they share at least one day AND their time windows overlap. Windows overlap when startMin_A < endMin_B AND startMin_B < endMin_A. Async courses (startMin: null) never conflict.
- Return 8–10 courses in strict priority order (best first). The scheduler will greedily accept courses in your order, skipping any that conflict with already-accepted ones, until 12–15 units are reached. Include backup options so the unit target can still be met even if some conflict.
- Respect any day/time constraints the student mentions.
- Prefer in-person unless the student asks for online.
- When the student asks to edit a previous schedule, reference your prior response and adjust accordingly.

You have two response modes:

1. SCHEDULE — when you have enough information to build a schedule, respond with ONLY this JSON (no markdown, no extra text):
{"crns":["12345","67890","backup1","backup2"],"reasoning":"..."}
The reasoning should sound like a friendly PCC academic counselor — warm, clear, encouraging. 2–4 natural sentences, no jargon, no abbreviations like "4u". Mention courses by name, explain choices plainly, end with an invitation to adjust.

2. CONVERSATION — when you need more information or want to clarify something, respond with plain conversational text only (no JSON at all). Be warm and brief, like a counselor asking a follow-up question. One or two sentences max.

Use CONVERSATION mode sparingly — prefer building a schedule with reasonable assumptions and noting them in the reasoning.`;

  // Keep only the last 6 turns (3 exchanges) to cap history token cost
  const trimmedMessages = messages.slice(-6);

  let message;
  try {
    message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: trimmedMessages,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Anthropic API error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const rawText = message.content[0].type === "text" ? message.content[0].text : "";
  const start = rawText.search(/[{[]/);
  const end = Math.max(rawText.lastIndexOf("}"), rawText.lastIndexOf("]"));
  const raw = start !== -1 && end !== -1 ? rawText.slice(start, end + 1) : rawText;

  let parsed: { crns: string[]; reasoning: string } | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // AI responded conversationally — return it as a message type
    return NextResponse.json({
      type: "message",
      message: rawText.trim(),
      courses: [],
      totalUnits: 0,
      reasoning: "",
      _raw: rawText.trim(),
    });
  }

  const selected = (parsed!.crns ?? [])
    .map((crn) => termCourses.find((c) => c.crn === crn))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  // ── Overlap guard ─────────────────────────────────────────────────────────
  // Two courses conflict if they share at least one day AND their time windows overlap.
  function conflicts(
    a: (typeof termCourses)[number],
    b: (typeof termCourses)[number]
  ) {
    if (a.startTime === "00:00" || b.startTime === "00:00") return false;
    if (!a.days.some((d) => b.days.includes(d))) return false;
    const aStart = toMin(a.startTime), aEnd = toMin(a.endTime);
    const bStart = toMin(b.startTime), bEnd = toMin(b.endTime);
    return aStart < bEnd && bStart < aEnd;
  }

  // Greedy: accept courses in priority order, skipping conflicts, until unit target is met.
  const TARGET_MIN = 12;
  const TARGET_MAX = 15;
  const deconflicted: (typeof termCourses)[number][] = [];
  const skipped: (typeof termCourses)[number][] = [];
  let unitsSoFar = 0;

  for (const course of selected) {
    if (unitsSoFar >= TARGET_MAX) break;
    if (deconflicted.every((added) => !conflicts(added, course))) {
      deconflicted.push(course);
      unitsSoFar += course.units;
    } else {
      skipped.push(course);
    }
  }

  // Patch reasoning so the UI and conversation history stay accurate.
  let finalReasoning = parsed.reasoning ?? "";
  if (skipped.length > 0 && unitsSoFar < TARGET_MIN) {
    const codes = skipped.map((c) => c.code).join(" and ");
    finalReasoning += ` Just a heads-up — ${codes} overlapped with other classes so I had to leave ${skipped.length === 1 ? "it" : "them"} out, and I couldn't quite hit 12 units with what's left. Let me know if you'd like to adjust your preferences and I'll try again!`;
  } else if (skipped.length > 0) {
    const codes = skipped.map((c) => c.code).join(" and ");
    finalReasoning += ` I swapped out ${codes} since ${skipped.length === 1 ? "it" : "they"} overlapped with another class, but the schedule still hits your unit goal with a great alternative.`;
  }

  // Corrected raw stored in conversation history — only the accepted CRNs.
  const correctedRaw = JSON.stringify({
    crns: deconflicted.map((c) => c.crn),
    reasoning: finalReasoning,
  });

  const schedule: ScheduleResponse = {
    courses: deconflicted.map((c) => ({
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
    })),
    totalUnits: deconflicted.reduce((s, c) => s + c.units, 0),
    type: "schedule",
    reasoning: finalReasoning,
    _raw: correctedRaw,
  } as ScheduleResponse & { _raw: string };

  return NextResponse.json(schedule);
}
