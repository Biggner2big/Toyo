"use client";

import React, { useState } from "react";
import { FieldDefinition } from "@/lib/types/database";
import { DynamicFormField } from "./DynamicFormField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Save, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";

export interface DynamicDocumentFormProps {
  fieldsSchema: FieldDefinition[];
  initialData?: Record<string, unknown>;
  documentTitle: string;
  onTitleChange: (title: string) => void;
  onFormDataChange: (data: Record<string, unknown>) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

export function DynamicDocumentForm({
  fieldsSchema,
  initialData = {},
  documentTitle,
  onTitleChange,
  onFormDataChange,
  onSave,
  isSaving = false,
}: DynamicDocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = { ...initialData };
    for (const field of fieldsSchema) {
      if (defaults[field.name] === undefined && field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    }
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    const updated = {
      ...formData,
      [fieldName]: value,
    };
    setFormData(updated);
    onFormDataChange(updated);

    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of fieldsSchema) {
      if (field.required) {
        const val = formData[field.name];
        if (val === undefined || val === null || val === "") {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    if (onSave) {
      setSaveSuccess(false);
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <Card className="p-6 bg-[#0f1624] border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Document Parameters</h2>
          <p className="text-xs text-slate-400">
            Fill out the required information to populate the document clauses.
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Document Title / Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Document Name / Reference <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0d1320] border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:border-sky-400 focus:ring-sky-400"
            placeholder="e.g. Non-Disclosure Agreement — Client Project Alpha"
          />
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4 pt-2">
          {fieldsSchema.map((field) => (
            <DynamicFormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={(val) => handleFieldChange(field.name, val)}
              error={errors[field.name]}
            />
          ))}
        </div>

        {/* Actions & Feedback */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Please complete all required fields highlighted in red.</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Document saved successfully to your account!</span>
          </div>
        )}

        {onSave && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Document Draft
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
