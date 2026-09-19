"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderClock,
  Search,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  FilePlus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DocumentRecord } from "@/lib/types/database";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { generatePdfBlob } from "@/lib/generators/pdfGenerator";
import { generateDocxBlob } from "@/lib/generators/docxGenerator";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";
import { Template } from "@/lib/types/database";

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalDoc, setDeleteModalDoc] = useState<DocumentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [dbError, setDbError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setDbError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load documents error:", error.message, error.details || error.hint);
        if (error.code === "42P01" || error.message.includes("does not exist") || error.message.includes("relation")) {
          setDbError("Database tables not found. Please run the SQL migration in your Supabase SQL Editor.");
        } else {
          setDbError(error.message || "Unable to load documents.");
        }
        setDocuments([]);
        return;
      }

      // Populate template metadata from SEED_TEMPLATES if not joined
      const enrichedDocs: DocumentRecord[] = (data || []).map((rawDoc: Record<string, unknown>) => {
        const doc = rawDoc as unknown as DocumentRecord;
        let matchedTemplate = doc.template;
        if (!matchedTemplate && doc.template_id) {
          matchedTemplate = SEED_TEMPLATES.find((t: Template) => t.id === doc.template_id || t.slug === doc.template_id) || null;
        }
        if (!matchedTemplate) {
          matchedTemplate = SEED_TEMPLATES.find((t: Template) =>
            doc.title?.toLowerCase().includes(t.name.toLowerCase()) ||
            doc.title?.toLowerCase().includes(t.slug.replace(/-/g, " "))
          ) || null;
        }
        return {
          ...doc,
          template: matchedTemplate,
        };
      });

      setDocuments(enrichedDocs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Failed to load documents:", msg);
      setDbError(msg || "Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchTitle = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTmpl = doc.template?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchTitle || matchTmpl;
    });
  }, [documents, searchQuery]);

  const handleDelete = async () => {
    if (!deleteModalDoc) return;
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", deleteModalDoc.id);

      if (error) throw error;

      setDocuments((prev) => prev.filter((d) => d.id !== deleteModalDoc.id));
      setDeleteModalDoc(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickDownloadPdf = async (doc: DocumentRecord) => {
    try {
      const blob = await generatePdfBlob({
        title: doc.title,
        compiledContent: doc.generated_content || "",
        templateCategory: doc.template?.category,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
    }
  };

  const handleQuickDownloadDocx = async (doc: DocumentRecord) => {
    try {
      const blob = await generateDocxBlob({
        title: doc.title,
        compiledContent: doc.generated_content || "",
        templateCategory: doc.template?.category,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export Word document.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FolderClock className="w-7 h-7 text-sky-400" />
            <span>My Documents</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View, edit, re-export, and manage all your generated pre-legal documents.
          </p>
        </div>

        <Link href="/templates">
          <Button variant="primary" size="md" icon={<FilePlus className="w-4 h-4" />}>
            New Document
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search documents by title or template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#0f1624] border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </div>

      {dbError && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Supabase Database Notice</span>
          </div>
          <p>{dbError}</p>
          <p className="text-[11px] text-amber-400/80">
            Run the SQL script from <code>supabase/migrations/001_initial_schema.sql</code> in your Supabase SQL Editor to create the <code>documents</code>, <code>templates</code>, and <code>profiles</code> tables.
          </p>
        </div>
      )}

      {/* Documents List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading your documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-[#0f1624] border border-slate-800 rounded-2xl p-8">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">No documents found</h3>
            <p className="text-xs text-slate-400">
              {searchQuery ? "No documents match your search criteria." : "You haven't generated any documents yet."}
            </p>
          </div>
          <Link href="/templates">
            <Button variant="outline" size="sm" icon={<FilePlus className="w-4 h-4" />}>
              Create a Document
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              hoverEffect
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f1624] border-slate-800"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-sm font-semibold text-slate-100 hover:text-sky-400 transition-colors"
                  >
                    {doc.title}
                  </Link>
                  <Badge variant="primary">{doc.status}</Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  {doc.template?.name && (
                    <span className="text-slate-300 font-medium">{doc.template.name}</span>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDownloadDocx(doc)}
                  className="text-xs px-2.5"
                  title="Download DOCX"
                >
                  DOCX
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDownloadPdf(doc)}
                  className="text-xs px-2.5"
                  title="Download PDF"
                >
                  PDF
                </Button>

                <Link href={`/documents/${doc.id}`}>
                  <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Open
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteModalDoc(doc)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 px-2.5"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModalDoc)}
        onClose={() => setDeleteModalDoc(null)}
        title="Confirm Document Deletion"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-rose-200">This action cannot be undone.</p>
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>&quot;{deleteModalDoc?.title}&quot;</strong>?
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalDoc(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete Document
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
