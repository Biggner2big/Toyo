import React from "react";
import Link from "next/link";
import { FileText, Shield, Scale, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#080b11] border-t border-slate-800/80 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span>Toyo Pre-Legal Document Generator</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A modern, template-driven SaaS document assistance engine for drafting pre-legal documents, contracts, engagement letters, and declarations with real-time preview and multi-format PDF & DOCX export.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-2">
              <Scale className="w-3.5 h-3.5 text-sky-400" />
              <span>Academic & Pre-Legal Drafting Tool</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase">Templates</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/templates/non-disclosure-agreement" className="hover:text-sky-400 transition-colors">
                  Non-Disclosure Agreement
                </Link>
              </li>
              <li>
                <Link href="/templates/independent-contractor-agreement" className="hover:text-sky-400 transition-colors">
                  Independent Contractor
                </Link>
              </li>
              <li>
                <Link href="/templates/professional-engagement-letter" className="hover:text-sky-400 transition-colors">
                  Engagement Letter
                </Link>
              </li>
              <li>
                <Link href="/templates/general-authorization-letter" className="hover:text-sky-400 transition-colors">
                  Authorization Letter
                </Link>
              </li>
              <li>
                <Link href="/templates/declaration-and-undertaking" className="hover:text-sky-400 transition-colors">
                  Declaration & Undertaking
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase">Compliance & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Supabase Row-Level Security (RLS) isolation</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                Toyo provides automated drafting tools. Generated documents are drafts and do not replace legal advice from a licensed attorney.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Toyo Pre-Legal Document Generator. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, TypeScript & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
