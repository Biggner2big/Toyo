"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2, Calendar, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DocumentRecord, Template } from "@/lib/types/database";
import { compileDocumentContent } from "@/lib/generators/documentCompiler";
import { DynamicDocumentForm } from "@/components/dynamic-form/DynamicDocumentForm";
import { DocumentLivePreview } from "@/components/document/DocumentLivePreview";
import { DocumentActionToolbar } from "@/components/document/DocumentActionToolbar";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DocumentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.id;
  const router = useRouter();
  const supabase = createClient();

  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: docData, error: docError } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .single();

        if (docError || !docData) {
          throw new Error("Document not found or access denied.");
        }

        const record = docData as unknown as DocumentRecord;
        setDocument(record);
        setDocumentTitle(record.title);
        setFormData(record.form_data || {});

        // Resolve template
        if (record.template) {
          setTemplate(record.template);
        } else if (record.template_id) {
          const matchedSeed = SEED_TEMPLATES.find((t) => t.id === record.template_id);
          if (matchedSeed) setTemplate(matchedSeed);
        }
      } catch (err) {
        console.error("Failed to load document:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocument();
  }, [documentId, router, supabase]);

  // If template is still null, fallback to first matching seed template or generic schema
  const activeTemplate = useMemo(() => {
    if (template) return template;
    if (document) {
      const match = SEED_TEMPLATES.find((t) =>
        document.title.toLowerCase().includes(t.slug.replace(/-/g, " "))
      );
      if (match) return match;
    }
    return SEED_TEMPLATES[0];
  }, [template, document]);

  const compiledContent = useMemo(() => {
    if (!activeTemplate) return document?.generated_content || "";
    return compileDocumentContent(
      activeTemplate.document_content,
      formData,
      activeTemplate.fields_schema
    );
  }, [activeTemplate, formData, document]);

  const handleUpdateDocument = async () => {
    if (!document) return;
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("documents")
        .update({
          title: documentTitle,
          form_data: formData,
          generated_content: compiledContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", document.id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update document:", err);
      alert("Failed to update document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!document) return;
    if (!confirm(`Are you sure you want to delete "${document.title}"?`)) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id);

      if (error) throw error;
      router.push("/documents");
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
        <p className="text-xs text-slate-400">Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="py-20 text-center space-y-4 bg-[#0f1624] border border-slate-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white">Document Not Found</h2>
        <p className="text-xs text-slate-400">
          This document could not be loaded or you do not have permission to view it.
        </p>
        <Link href="/documents">
          <Button variant="outline" size="sm">
            Back to My Documents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Actions */}
      <div className="space-y-3">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Documents</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-white tracking-tight">{documentTitle}</h1>
              <Badge variant="primary">{document.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {new Date(document.created_at).toLocaleDateString()}</span>
              </div>
              {activeTemplate && <span>Template: {activeTemplate.name}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteDocument}
              isLoading={isDeleting}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Export Toolbar */}
      <DocumentActionToolbar
        title={documentTitle}
        compiledContent={compiledContent}
        category={activeTemplate?.category}
        onSave={handleUpdateDocument}
        isSaving={isSaving}
      />

      {/* Split Pane: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <DynamicDocumentForm
            fieldsSchema={activeTemplate.fields_schema}
            initialData={formData}
            documentTitle={documentTitle}
            onTitleChange={setDocumentTitle}
            onFormDataChange={setFormData}
            onSave={handleUpdateDocument}
            isSaving={isSaving}
          />
        </div>

        <div className="lg:col-span-7 sticky top-20">
          <DocumentLivePreview
            title={documentTitle}
            compiledContent={compiledContent}
            category={activeTemplate.category}
          />
        </div>
      </div>
    </div>
  );
}
