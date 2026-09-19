import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  BorderStyle,
} from "docx";

export interface DocxGenerationOptions {
  title: string;
  compiledContent: string;
  templateCategory?: string;
  createdAt?: string;
}

/**
 * Generates a clean, professional Microsoft Word (.docx) binary Blob.
 */
export async function generateDocxBlob(options: DocxGenerationOptions): Promise<Blob> {
  const { title, compiledContent, templateCategory } = options;

  const lines = compiledContent.split("\n");
  const paragraphs: Paragraph[] = [];

  // Document Title / Header
  paragraphs.push(
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 200,
        after: 300,
      },
      style: "Title",
    })
  );

  if (templateCategory) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Category: ${templateCategory}`,
            italics: true,
            size: 20, // 10pt
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
        },
      })
    );
  }

  // Parse lines into styled paragraphs
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    if (!rawLine) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 150 },
        })
      );
      continue;
    }

    // Check if line is a numbered section heading (e.g. "1. PURPOSE", "2. CONFIDENTIAL INFORMATION")
    const isSectionHeading = /^[0-9]+\.\s+[A-Z\s/&-]+$/.test(rawLine);
    // Check if line is an all-caps subtitle or declaration title
    const isAllCapsTitle = /^[A-Z\s,"()'-]{4,}$/.test(rawLine) && !rawLine.startsWith("THIS ") && !rawLine.startsWith("IN WITNESS");

    if (isSectionHeading) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 24, // 12pt
              font: "Calibri",
              color: "111827",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 240,
            after: 120,
          },
        })
      );
    } else if (isAllCapsTitle && i < 4) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 22,
              font: "Calibri",
              color: "1f2937",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 120,
            after: 200,
          },
        })
      );
    } else if (rawLine.startsWith("__________________")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: rawLine,
              color: "374151",
            }),
          ],
          spacing: {
            before: 200,
            after: 60,
          },
        })
      );
    } else {
      // Regular paragraph with standard legal indentation and spacing
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: rawLine,
              size: 22, // 11pt
              font: "Calibri",
              color: "1f2937",
            }),
          ],
          spacing: {
            line: 276, // 1.15 line spacing
            after: 120,
          },
        })
      );
    }
  }

  const doc = new Document({
    creator: "Toyo Pre-Legal Document Generator",
    description: "Pre-legal draft document generated via Toyo SaaS",
    title: title,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Page ",
                    size: 18,
                    color: "888888",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: "888888",
                  }),
                  new TextRun({
                    text: " of ",
                    size: 18,
                    color: "888888",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: "888888",
                  }),
                  new TextRun({
                    text: " | Pre-Legal Document Draft (Not Legal Advice)",
                    italics: true,
                    size: 16,
                    color: "999999",
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}
