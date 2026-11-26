"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";

export interface AcademicCalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  category?: string;
}

interface DnscAcademicCalendarSectionProps {
  events?: AcademicCalendarEvent[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function toDateKey(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function DnscAcademicCalendarSection({
  events = [],
}: DnscAcademicCalendarSectionProps) {
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] =
    useState<AcademicCalendarEvent | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AcademicCalendarEvent[]>();
    for (const event of events) {
      const existing = map.get(event.date) ?? [];
      existing.push(event);
      map.set(event.date, existing);
    }
    return map;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events, todayKey]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  return (
    <section
      aria-labelledby="academic-calendar-heading"
      className="rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6EFE8] text-[#174D32]">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="academic-calendar-heading"
              className="text-lg font-bold text-[#25352B]"
            >
              DNSC Academic Calendar
            </h2>
            <p className="text-xs text-slate-500">
              Academic dates and verified institutional schedules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleJumpToday}
            className="rounded-lg border border-slate-200 bg-[#F5F5EF] px-3 py-2 text-xs font-semibold text-[#174D32] transition-colors hover:border-[#174D32]/40 hover:bg-[#E6EFE8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#25352B] transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-[155px] text-center text-sm font-bold text-[#25352B] sm:text-base">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#25352B] transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-12">
        {/* Monthly Calendar Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-7 gap-1.5 text-center sm:gap-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-xs font-bold tracking-wide text-slate-500 uppercase"
              >
                {day}
              </div>
            ))}

            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-12 sm:h-14" />;
              }

              const dateKey = toDateKey(viewYear, viewMonth, day);
              const isToday = dateKey === todayKey;
              const dayEvents = eventsByDate.get(dateKey) ?? [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={!hasEvents}
                  onClick={() => {
                    if (dayEvents[0]) setSelectedEvent(dayEvents[0]);
                  }}
                  aria-label={
                    hasEvents
                      ? `${monthLabel} ${day}: ${dayEvents.map((e) => e.title).join(", ")}`
                      : `${monthLabel} ${day}`
                  }
                  className={`relative flex h-12 flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors sm:h-14 ${
                    isToday
                      ? "bg-[#174D32] font-bold text-white shadow-xs"
                      : hasEvents
                        ? "bg-[#E6EFE8] font-semibold text-[#174D32] hover:bg-[#246B45] hover:text-white"
                        : "cursor-default border border-slate-100 text-[#25352B] hover:bg-[#F5F5EF]"
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && (
                    <span
                      aria-hidden="true"
                      className={`mt-1 h-1.5 w-1.5 rounded-full ${
                        isToday ? "bg-white" : "bg-[#174D32]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events / Truthful Empty State */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-[#F5F5EF]/75 p-5 lg:col-span-4">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-[#25352B] uppercase">
              Upcoming Academic Dates
            </h3>

            {upcomingEvents.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-4 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EFE8] text-[#174D32]">
                  <Info className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="mt-2.5 text-xs font-semibold text-[#25352B]">
                  Academic Calendar Data Currently Unavailable
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Official DNSC academic dates, semester schedules, and
                  Registrar deadlines have not been published here yet. Verified
                  events will appear automatically once integrated.
                </p>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-[#246B45]/40 hover:bg-[#E6EFE8]/40"
                    >
                      <p className="text-[11px] font-semibold text-[#174D32]">
                        {event.date}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#25352B]">
                        {event.title}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedEvent && (
              <div className="mt-3 rounded-lg border border-[#246B45]/25 bg-[#E6EFE8]/60 p-3 text-xs">
                <p className="font-bold text-[#25352B]">
                  {selectedEvent.title}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#174D32]">
                  {selectedEvent.date}
                </p>
                {selectedEvent.description && (
                  <p className="mt-1 text-slate-700">
                    {selectedEvent.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Today:{" "}
            <span className="font-semibold text-[#25352B]">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
