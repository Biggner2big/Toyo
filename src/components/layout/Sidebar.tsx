"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  FolderClock,
  User,
  LogOut,
  FilePlus,
  Scale,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Document Templates", href: "/templates", icon: FileStack },
    { label: "My Documents", href: "/documents", icon: FolderClock },
    { label: "Profile & Settings", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0">
      <div className="p-4 space-y-6">
        {/* Quick Action */}
        <Link
          href="/templates"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
        >
          <FilePlus className="w-4 h-4" />
          <span>Draft New Document</span>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800/90 text-sky-400 border border-slate-700/60"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
          <Scale className="w-3.5 h-3.5 text-slate-400" />
          <span>Toyo Pre-Legal SaaS</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
