import { FieldDefinition } from "../types/database";

/**
 * Compiles a raw template string by replacing {{field_name}} tokens with formatted form data.
 */
export function compileDocumentContent(
  templateContent: string,
  formData: Record<string, unknown>,
  fieldsSchema: FieldDefinition[]
): string {
  let compiled = templateContent;

  for (const field of fieldsSchema) {
    const token = new RegExp(`\\{\\{${field.name}\\}\\}`, "g");
    const rawVal = formData[field.name];

    let formattedVal = "";
    if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
      if (typeof rawVal === "boolean") {
        formattedVal = rawVal ? "Yes / Confirmed" : "No / Declined";
      } else if (typeof rawVal === "string" || typeof rawVal === "number") {
        formattedVal = String(rawVal).trim();
      } else {
        formattedVal = JSON.stringify(rawVal);
      }
    } else {
      formattedVal = `[ ${field.label.toUpperCase()} ]`;
    }

    compiled = compiled.replace(token, formattedVal);
  }

  // Replace any leftover unknown {{token}} with placeholder brackets
  compiled = compiled.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
    return `[ ${key.replace(/_/g, " ").toUpperCase()} ]`;
  });

  return compiled;
}

/**
 * Validates whether all required fields in the schema have been filled in.
 */
export function validateFormDataCompleteness(
  formData: Record<string, unknown>,
  fieldsSchema: FieldDefinition[]
): { isComplete: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of fieldsSchema) {
    if (field.required) {
      const val = formData[field.name];
      if (val === undefined || val === null || val === "") {
        missingFields.push(field.label);
      }
    }
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}
