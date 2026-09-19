import { jsPDF } from "jspdf";

export interface PdfGenerationOptions {
  title: string;
  compiledContent: string;
  templateCategory?: string;
  authorName?: string;
}

/**
 * Generates a high-quality, paginated PDF Blob with margins, headers, and footers.
 */
export async function generatePdfBlob(options: PdfGenerationOptions): Promise<Blob> {
  const { title, compiledContent, templateCategory } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54; // 0.75 inch
  const marginTop = 60;
  const marginBottom = 60;
  const contentWidth = pageWidth - marginX * 2;
  const usableHeight = pageHeight - marginTop - marginBottom;

  let cursorY = marginTop;
  let pageNumber = 1;

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);

  const titleLines = doc.splitTextToSize(title.toUpperCase(), contentWidth);
  for (const tLine of titleLines) {
    doc.text(tLine, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 22;
  }

  if (templateCategory) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`Category: ${templateCategory} | Draft Document`, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 18;
  }

  // Decorative header divider line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 25;

  // Content Paragraphs
  const rawParagraphs = compiledContent.split("\n");

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - marginBottom) {
      addFooter(doc, pageNumber, pageWidth, pageHeight, marginX);
      doc.addPage();
      pageNumber++;
      cursorY = marginTop;
    }
  };

  for (const p of rawParagraphs) {
    const trimmed = p.trim();

    if (!trimmed) {
      cursorY += 10;
      continue;
    }

    const isSectionHeading = /^[0-9]+\.\s+[A-Z\s/&-]+$/.test(trimmed);
    const isSignatureLine = trimmed.startsWith("__________________");

    if (isSectionHeading) {
      checkPageBreak(30);
      cursorY += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(17, 24, 39);
      doc.text(trimmed, marginX, cursorY);
      cursorY += 18;
    } else if (isSignatureLine) {
      checkPageBreak(40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text(trimmed, marginX, cursorY);
      cursorY += 16;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);

      const wrappedLines = doc.splitTextToSize(trimmed, contentWidth);
      const neededHeight = wrappedLines.length * 15;
      checkPageBreak(neededHeight);

      for (const line of wrappedLines) {
        doc.text(line, marginX, cursorY);
        cursorY += 15;
      }
      cursorY += 6;
    }
  }

  // Add footer to last page
  addFooter(doc, pageNumber, pageWidth, pageHeight, marginX);

  return doc.output("blob");
}

function addFooter(
  doc: jsPDF,
  pageNumber: number,
  pageWidth: number,
  pageHeight: number,
  marginX: number
) {
  const footerY = pageHeight - 30;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);

  doc.text(
    "Toyo Pre-Legal Generator — For drafting and pre-legal assistance only. Not qualified legal advice.",
    marginX,
    footerY
  );

  doc.text(
    `Page ${pageNumber}`,
    pageWidth - marginX,
    footerY,
    { align: "right" }
  );
}
