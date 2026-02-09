export function parseCSV(csv: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csv.trim().split('\n');
  if (lines.length === 0) throw new Error('Empty CSV');

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  return { headers, rows };
}

export function validateCSVHasEmail(headers: string[]): boolean {
  return headers.some((h) => h.toLowerCase() === 'email');
}
