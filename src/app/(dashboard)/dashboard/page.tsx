import React from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  FolderClock,
  Layers,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";
import { DocumentRecord } from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userDocuments: DocumentRecord[] = [];
  let userProfileName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  if (user) {
    // Fetch profile if exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      userProfileName = profile.full_name;
    }

    // Fetch user documents
    const { data: docs } = await supabase
      .from("documents")
      .select("*, template:templates(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (docs) {
      userDocuments = docs as unknown as DocumentRecord[];
    }
  }

  const totalDocsCount = userDocuments.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0f172a] to-[#0a1120] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <Badge variant="primary">Pre-Legal Drafting Hub</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {userProfileName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Select a verified pre-legal template to begin drafting contracts, authorization letters, or non-disclosure agreements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/templates">
            <Button size="md" variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
              Create Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4 p-5 bg-[#0f1624]">
          <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-800/60 text-sky-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">My Saved Documents</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalDocsCount}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 bg-[#0f1624]">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Available Templates</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{SEED_TEMPLATES.length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 bg-[#0f1624]">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Export Formats</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">PDF & DOCX</h3>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Quick Templates & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates Quick Access (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Pre-Legal Templates</h2>
              <p className="text-xs text-slate-400">Select a template to generate a new document.</p>
            </div>
            <Link href="/templates" className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEED_TEMPLATES.slice(0, 4).map((tmpl) => (
              <Card key={tmpl.slug} hoverEffect className="flex flex-col justify-between space-y-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{tmpl.category}</Badge>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {tmpl.fields_schema.length} fields
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">{tmpl.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
                <div className="pt-2">
                  <Link href={`/templates/${tmpl.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Documents Panel (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Documents</h2>
              <p className="text-xs text-slate-400">Your latest created drafts.</p>
            </div>
            <Link href="/documents" className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-4 bg-[#0f1624] space-y-3">
            {userDocuments.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FolderClock className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No documents created yet.</p>
                <Link href="/templates">
                  <Button variant="outline" size="sm">
                    Create Your First Draft
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {userDocuments.map((doc) => (
                  <div key={doc.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="text-xs font-semibold text-slate-200 hover:text-sky-400 transition-colors truncate block"
                      >
                        {doc.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm" className="px-2">
                        Open
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
