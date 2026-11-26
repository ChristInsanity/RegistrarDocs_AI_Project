"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FilePlus2,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import type { SafeUser } from "@/types/auth";

interface RequesterShellProps {
  user: SafeUser;
  children: React.ReactNode;
}

const REQUESTER_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard/requester",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Request a Document",
    href: "/dashboard/requester/request",
    icon: FilePlus2,
    exact: false,
  },
  {
    label: "My Requests",
    href: "/dashboard/requester/requests",
    icon: ClipboardList,
    exact: false,
  },
  {
    label: "Notifications",
    href: "/dashboard/requester/notifications",
    icon: Bell,
    exact: false,
  },
  {
    label: "FAQs & Help",
    href: "/dashboard/requester/help",
    icon: HelpCircle,
    exact: false,
  },
  {
    label: "My Profile",
    href: "/dashboard/requester/profile",
    icon: User,
    exact: false,
  },
] as const;

export function RequesterShell({ user, children }: RequesterShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const renderNavLinks = (onSelect?: () => void) => (
    <ul className="space-y-1">
      {REQUESTER_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onSelect}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45] ${
                active
                  ? "bg-[#174D32] text-white shadow-2xs"
                  : "text-slate-700 hover:bg-[#E6EFE8] hover:text-[#174D32]"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active ? "text-white" : "text-[#174D32]"
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen bg-[#F5F5EF] text-[#25352B]">
      {/* Desktop Sidebar */}
      <aside
        aria-label="Requester sidebar navigation"
        className="hidden w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white lg:flex"
      >
        <div className="border-b border-slate-200/80 px-5 py-4">
          <BrandMark href="/dashboard/requester" />
        </div>

        <nav aria-label="Requester navigation" className="flex-1 px-3 py-5">
          <p className="mb-2.5 px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Requester Portal
          </p>
          {renderNavLinks()}
        </nav>

        <div className="border-t border-slate-200/80 p-3">
          <div className="mb-3 rounded-xl border border-slate-200/80 bg-[#F5F5EF]/80 px-3 py-2.5">
            <p className="truncate text-xs font-semibold text-[#25352B]">
              {user.fullName}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-600">
              {user.studentId ? `ID: ${user.studentId}` : user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{isLoggingOut ? "Signing Out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#25352B]/40"
            aria-hidden="true"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            id="requester-mobile-sidebar"
            aria-label="Mobile requester navigation"
            className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
              <BrandMark href="/dashboard/requester" />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-[#25352B] transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="mb-2.5 px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Requester Portal
              </p>
              {renderNavLinks(() => setMobileNavOpen(false))}
            </nav>

            <div className="border-t border-slate-200 p-3">
              <div className="mb-3 rounded-xl border border-slate-200/80 bg-[#F5F5EF]/80 px-3 py-2.5">
                <p className="truncate text-xs font-semibold text-[#25352B]">
                  {user.fullName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-slate-600">
                  {user.studentId ? `ID: ${user.studentId}` : user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{isLoggingOut ? "Signing Out..." : "Logout"}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-expanded={mobileNavOpen}
                aria-controls="requester-mobile-sidebar"
                aria-label="Open navigation menu"
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 p-2 text-[#25352B] transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45] lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0 lg:hidden">
                <BrandMark href="/dashboard/requester" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-[#25352B]">
                  DNSC Registrar&apos;s Office Document Portal
                </p>
                <p className="text-xs text-slate-500">
                  Requester Account &middot; Approved
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <span className="hidden rounded-full border border-[#246B45]/25 bg-[#E6EFE8] px-3 py-1 text-xs font-semibold text-[#174D32] md:inline-flex">
                {user.studentId ? `Student ID: ${user.studentId}` : "Requester"}
              </span>
              <Link
                href="/dashboard/requester/profile"
                aria-label={`My Profile (${user.fullName})`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-[#25352B] transition-colors hover:border-[#174D32]/40 hover:bg-[#E6EFE8] hover:text-[#174D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#246B45] sm:px-3 sm:py-1.5"
              >
                <User className="h-4 w-4 text-[#174D32] sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <span className="hidden max-w-[140px] truncate sm:inline">
                  {user.fullName}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {children}
        </main>

        <footer className="border-t border-slate-200/80 bg-white py-4">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
            <p>&copy; {currentYear} RegistrarDocs AI. All rights reserved.</p>
            <p>Pilot Institution: Davao del Norte State College (DNSC)</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
