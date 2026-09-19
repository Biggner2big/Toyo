import React from "react";
import { FieldDefinition } from "@/lib/types/database";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export interface DynamicFormFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function DynamicFormField({
  field,
  value,
  onChange,
  error,
}: DynamicFormFieldProps) {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.name}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          rows={3}
        />
      );

    case "select":
      return (
        <Select
          id={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          options={field.options || []}
          value={(value as string) || (field.defaultValue as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );

    case "date":
      return (
        <Input
          id={field.name}
          name={field.name}
          label={field.label}
          type="date"
          required={field.required}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );

    case "number":
      return (
        <Input
          id={field.name}
          name={field.name}
          label={field.label}
          type="number"
          placeholder={field.placeholder}
          required={field.required}
          value={value !== undefined ? String(value) : ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
          error={error}
        />
      );

    case "email":
      return (
        <Input
          id={field.name}
          name={field.name}
          label={field.label}
          type="email"
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );

    case "checkbox":
      return (
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id={field.name}
            name={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded mt-0.5 bg-[#0d1320] border-slate-700 text-sky-500 focus:ring-sky-400"
          />
          <label htmlFor={field.name} className="text-xs font-medium text-slate-300 cursor-pointer">
            {field.label}
            {field.required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
        </div>
      );

    case "text":
    case "address":
    case "phone":
    default:
      return (
        <Input
          id={field.name}
          name={field.name}
          label={field.label}
          type="text"
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );
  }
}
