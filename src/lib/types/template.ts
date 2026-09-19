import { FieldDefinition, Template, DocumentRecord } from "./database";

export type { FieldDefinition, Template, DocumentRecord };

export interface DocumentGenerationPayload {
  templateId: string;
  templateSlug: string;
  title: string;
  formData: Record<string, string | number | boolean>;
  generatedContent: string;
}

export interface ExportFileResult {
  filename: string;
  blob: Blob;
  mimeType: string;
}
