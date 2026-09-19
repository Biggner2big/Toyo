import React from "react";
import { ShieldAlert } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/40 border-y border-amber-800/40 px-4 py-2 text-xs text-amber-300/90 flex items-center justify-center gap-2">
      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
      <span>
        <strong>Legal Notice:</strong> Toyo is an academic pre-legal drafting assistant. Documents generated do not constitute formal legal advice and may require review by a qualified legal attorney.
      </span>
    </div>
  );
}
