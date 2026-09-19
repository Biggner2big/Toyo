"use client";

import React from "react";
import { FileText, Eye, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface DocumentLivePreviewProps {
  title: string;
  compiledContent: string;
  category?: string;
}

export function DocumentLivePreview({
  title,
  compiledContent,
  category,
}: DocumentLivePreviewProps) {
  const paragraphs = compiledContent.split("\n");

  return (
    <div className="flex flex-col h-full bg-[#0d1320] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Preview Bar */}
      <div className="px-4 py-3 bg-[#0a0e17] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">Live Document Preview</span>
          {category && <Badge variant="primary">{category}</Badge>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>Standard Legal Layout</span>
        </div>
      </div>

      {/* Document Paper Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#070a10]">
        <div className="max-w-[780px] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-14 min-h-[900px] border border-slate-300 flex flex-col justify-between font-serif text-sm leading-relaxed">
          <div className="space-y-4">
            {/* Document Title */}
            <div className="text-center pb-6 border-b border-slate-200 space-y-1">
              <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-950 font-sans">
                {title || "DOCUMENT TITLE"}
              </h1>
              {category && (
                <p className="text-[11px] text-slate-500 font-sans italic">
                  Category: {category}
                </p>
              )}
            </div>

            {/* Document Content Flow */}
            <div className="space-y-3 pt-2 text-slate-800 text-[13px] sm:text-[14px] leading-relaxed">
              {paragraphs.map((p, idx) => {
                const trimmed = p.trim();
                if (!trimmed) {
                  return <div key={idx} className="h-2" />;
                }

                const isSectionHeading = /^[0-9]+\.\s+[A-Z\s/&-]+$/.test(trimmed);
                const isSignatureLine = trimmed.startsWith("__________________");
                const isAllCapTitle =
                  /^[A-Z\s,"()'-]{4,}$/.test(trimmed) &&
                  !trimmed.startsWith("THIS ") &&
                  !trimmed.startsWith("IN WITNESS");

                if (isSectionHeading) {
                  return (
                    <h2
                      key={idx}
                      className="text-xs sm:text-sm font-bold text-slate-950 uppercase pt-3 pb-0.5 tracking-wide font-sans"
                    >
                      {trimmed}
                    </h2>
                  );
                }

                if (isAllCapTitle && idx < 4) {
                  return (
                    <h2
                      key={idx}
                      className="text-center font-bold text-slate-950 uppercase py-1 text-sm tracking-wide font-sans"
                    >
                      {trimmed}
                    </h2>
                  );
                }

                if (isSignatureLine) {
                  return (
                    <div key={idx} className="pt-4 text-slate-700 font-mono text-xs">
                      {trimmed}
                    </div>
                  );
                }

                // Highlight unpopulated tokens like [ PENDING: ... ] in amber
                const hasPendingPlaceholder = /\[\s*[A-Z0-9_\s/-]+\s*\]/.test(trimmed);

                if (hasPendingPlaceholder) {
                  const parts = trimmed.split(/(\[\s*[A-Z0-9_\s/-]+\s*\])/g);
                  return (
                    <p key={idx} className="text-justify leading-relaxed">
                      {parts.map((part, pIdx) => {
                        if (/^\[\s*[A-Z0-9_\s/-]+\s*\]$/.test(part)) {
                          return (
                            <span
                              key={pIdx}
                              className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-semibold"
                            >
                              {part}
                            </span>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                }

                return (
                  <p key={idx} className="text-justify leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Footer Notice on Page */}
          <div className="pt-12 mt-12 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between font-sans">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-slate-400" />
              Pre-Legal Document Draft — Not qualified legal advice.
            </span>
            <span>Generated by Toyo SaaS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
