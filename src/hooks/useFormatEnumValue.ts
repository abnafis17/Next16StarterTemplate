export function useFormattedEnumValue(value?: string | null): string {
  if (!value || typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}
