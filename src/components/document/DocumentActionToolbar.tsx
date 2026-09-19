"use client";

import React, { useState } from "react";
import { Download, FileText, Printer, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generatePdfBlob } from "@/lib/generators/pdfGenerator";
import { generateDocxBlob } from "@/lib/generators/docxGenerator";

export interface DocumentActionToolbarProps {
  title: string;
  compiledContent: string;
  category?: string;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

export function DocumentActionToolbar({
  title,
  compiledContent,
  category,
  onSave,
  isSaving = false,
}: DocumentActionToolbarProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  const getSafeFileName = (extension: string) => {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${cleanTitle || "document"}.${extension}`;
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const pdfBlob = await generatePdfBlob({
        title,
        compiledContent,
        templateCategory: category,
      });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getSafeFileName("pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      const docxBlob = await generateDocxBlob({
        title,
        compiledContent,
        templateCategory: category,
      });

      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getSafeFileName("docx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate DOCX:", err);
      alert("An error occurred while generating the Word document. Please try again.");
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0d1320] border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <FileDown className="w-4 h-4 text-sky-400" />
        <span className="font-medium text-slate-300">Document Export & Actions</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
        >
          Print
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownloadDocx}
          isLoading={isDownloadingDocx}
          icon={<FileText className="w-4 h-4 text-blue-400" />}
        >
          Download DOCX
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleDownloadPdf}
          isLoading={isDownloadingPdf}
          icon={<Download className="w-4 h-4" />}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
