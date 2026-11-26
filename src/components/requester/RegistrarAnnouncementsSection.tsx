import { AlertTriangle, Megaphone } from "lucide-react";

export interface RegistrarAnnouncementItem {
  id: string;
  title: string;
  message: string;
  publishedAt: string;
  priority: "urgent" | "normal";
  category?: string;
}

interface RegistrarAnnouncementsSectionProps {
  announcements?: RegistrarAnnouncementItem[];
}

export function RegistrarAnnouncementsSection({
  announcements = [],
}: RegistrarAnnouncementsSectionProps) {
  return (
    <section
      aria-labelledby="registrar-announcements-heading"
      className="rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EFE8] text-[#174D32]">
          <Megaphone className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2
            id="registrar-announcements-heading"
            className="text-base font-bold text-[#25352B]"
          >
            Registrar&apos;s Announcements &amp; Reminders
          </h2>
          <p className="text-xs text-slate-500">
            Official notices, schedules, and reminders published by the DNSC
            Registrar&apos;s Office
          </p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="px-5 py-8 text-center sm:px-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6EFE8] text-[#174D32]">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-[#25352B]">
            No Published Announcements Yet
          </h3>
          <p className="mx-auto mt-1.5 max-w-lg text-xs leading-relaxed text-slate-600">
            There are currently no published Registrar&apos;s Office
            announcements or reminders. Official office schedules, document
            request instructions, deadlines, and service notices published by
            authorized Registrar Staff or Administrators will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {announcements.map((item) => {
            const isUrgent = item.priority === "urgent";
            return (
              <li
                key={item.id}
                className={`px-5 py-4 sm:px-6 ${
                  isUrgent ? "bg-amber-50/50" : "bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isUrgent && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-900 uppercase">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        Urgent Notice
                      </span>
                    )}
                    {item.category && (
                      <span className="rounded-full bg-[#E6EFE8] px-2.5 py-0.5 text-[10px] font-semibold text-[#174D32]">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {item.publishedAt}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-[#25352B]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.message}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
