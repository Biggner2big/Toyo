"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";
import { compileDocumentContent } from "@/lib/generators/documentCompiler";
import { DynamicDocumentForm } from "@/components/dynamic-form/DynamicDocumentForm";
import { DocumentLivePreview } from "@/components/document/DocumentLivePreview";
import { DocumentActionToolbar } from "@/components/document/DocumentActionToolbar";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TemplatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TemplateGenerationPage({ params }: TemplatePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const supabase = createClient();

  const template = useMemo(() => {
    return SEED_TEMPLATES.find((t) => t.slug === slug);
  }, [slug]);

  const [documentTitle, setDocumentTitle] = useState<string>(
    template ? `${template.name} — ${new Date().toLocaleDateString()}` : "Document Draft"
  );
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Compile content in real time based on formData
  const compiledContent = useMemo(() => {
    if (!template) return "";
    return compileDocumentContent(
      template.document_content,
      formData,
      template.fields_schema
    );
  }, [template, formData]);

  if (!template) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Template Not Found</h2>
        <p className="text-xs text-slate-400">The requested document template does not exist.</p>
        <Link href="/templates">
          <Button variant="outline" size="sm">
            Back to Templates
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveDocument = async () => {
    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if template exists in DB or insert by slug
      let dbTemplateId = template.id;
      const { data: existingTmpl } = await supabase
        .from("templates")
        .select("id")
        .eq("slug", template.slug)
        .maybeSingle();

      if (existingTmpl?.id) {
        dbTemplateId = existingTmpl.id;
      }

      const { data: insertedDoc, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          template_id: dbTemplateId,
          title: documentTitle,
          status: "completed",
          form_data: formData,
          generated_content: compiledContent,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (insertedDoc) {
        router.push(`/documents/${insertedDoc.id}`);
      }
    } catch (err: unknown) {
      console.error("Failed to save document:", err);
      alert("Failed to save document to your account. Please verify database connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-3">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Templates</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{template.name}</h1>
              <Badge variant="primary">{template.category}</Badge>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">{template.description}</p>
          </div>
        </div>
      </div>

      {/* Export Action Toolbar */}
      <DocumentActionToolbar
        title={documentTitle}
        compiledContent={compiledContent}
        category={template.category}
        onSave={handleSaveDocument}
        isSaving={isSaving}
      />

      {/* Two-Column Editor Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <DynamicDocumentForm
            fieldsSchema={template.fields_schema}
            initialData={formData}
            documentTitle={documentTitle}
            onTitleChange={setDocumentTitle}
            onFormDataChange={setFormData}
            onSave={handleSaveDocument}
            isSaving={isSaving}
          />
        </div>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-7 sticky top-20">
          <DocumentLivePreview
            title={documentTitle}
            compiledContent={compiledContent}
            category={template.category}
          />
        </div>
      </div>
    </div>
  );
}
