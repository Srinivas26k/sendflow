export function renderTemplate(
  template: string,
  data: Record<string, string>
): string {
  let result = template;
  for (const key in data) {
    result = result.replaceAll(`{{${key}}}`, data[key] ?? '');
  }
  return result;
}

export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const placeholders: string[] = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    placeholders.push(match[1]);
  }
  return [...new Set(placeholders)];
}
