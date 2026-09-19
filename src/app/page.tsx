import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Download,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0e1424] via-[#0a0d14] to-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, Structured & Secure Pre-Legal Drafting</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Draft Professional Pre-Legal Documents in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Minutes</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select verified pre-legal document templates, fill intuitive dynamic forms, preview formatted agreements in real-time, and download ready-to-use <strong>PDF</strong> and <strong>DOCX</strong> files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Start Drafting Free
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="secondary" icon={<Layers className="w-4 h-4" />}>
                Explore Templates
              </Button>
            </Link>
          </div>

          {/* Value Props Strip */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free SaaS — No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant PDF & DOCX Export</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Supabase RLS Tenant Isolation</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Workflow Section */}
      <section id="workflow" className="py-20 border-b border-slate-800/80 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="primary">Simple 4-Step Workflow</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How Toyo Streamlines Document Drafting
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              From template selection to export in under 60 seconds with zero legal friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card hoverEffect className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 font-bold text-base">
                1
              </div>
              <CardTitle className="text-sm">Choose a Template</CardTitle>
              <CardDescription>
                Select from standard NDAs, Contractor Agreements, Engagement Letters, or Declarations.
              </CardDescription>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-base">
                2
              </div>
              <CardTitle className="text-sm">Fill Dynamic Form</CardTitle>
              <CardDescription>
                Enter party information, terms, dates, and contract clauses via validated smart inputs.
              </CardDescription>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-bold text-base">
                3
              </div>
              <CardTitle className="text-sm">Live Real-Time Preview</CardTitle>
              <CardDescription>
                Review formatted clauses and typography live side-by-side with instant token substitution.
              </CardDescription>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 font-bold text-base">
                4
              </div>
              <CardTitle className="text-sm">Download PDF & DOCX</CardTitle>
              <CardDescription>
                Instantly export high-resolution PDF or editable Microsoft Word (.docx) files.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section id="templates" className="py-20 border-b border-slate-800/80 bg-[#0d121f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="primary">Pre-Built Templates</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Document Catalog
              </h2>
              <p className="text-slate-400 text-sm">
                Carefully crafted pre-legal templates with dynamic schema definitions.
              </p>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View All Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEED_TEMPLATES.map((tmpl) => (
              <Card key={tmpl.slug} hoverEffect className="flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{tmpl.category}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {tmpl.fields_schema.length} fields
                    </span>
                  </div>
                  <CardTitle className="text-base">{tmpl.name}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {tmpl.description}
                  </CardDescription>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">PDF & DOCX</span>
                  <Link href={`/templates/${tmpl.slug}`}>
                    <Button size="sm" variant="primary">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 border-b border-slate-800/80 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="primary">Why Choose Toyo</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise-Grade Tech Stack & Security
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#0f1624] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Supabase Row-Level Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your private documents are protected directly at the PostgreSQL database level using strict RLS policies.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1624] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Dual PDF & DOCX Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export to clean, paginated PDF for instant signature or formatted Word (.docx) for custom editing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1624] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Dynamic Schema Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add new document templates effortlessly with JSON schema definitions without altering core UI components.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-t from-[#0e1424] to-[#0a0d14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Generate Your Pre-Legal Documents?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Create your free account now and start drafting customized contracts and agreements with real-time preview.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
