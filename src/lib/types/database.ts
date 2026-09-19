export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "date" | "address" | "number" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  template_type: string;
  fields_schema: FieldDefinition[];
  document_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  status: "draft" | "completed";
  form_data: Record<string, unknown>;
  generated_content: string | null;
  created_at: string;
  updated_at: string;
  template?: Template | null;
}
