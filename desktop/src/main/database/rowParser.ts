function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; }
    catch { return []; }
  }
  return [];
}

function parseBook(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    title: row.title as string,
    author: row.author as string,
    publisher: (row.publisher as string) || undefined,
    isbn: (row.isbn as string) || undefined,
    cover: (row.cover as string) || undefined,
    tags: parseTags(row.tags),
    status: row.status as string,
    progress: row.progress as number,
    reading_minutes: row.reading_minutes as number,
  };
}

function parseNote(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    bookId: row.book_id as number,
    title: row.title as string,
    markdown: row.markdown as string,
    tags: parseTags(row.tags),
    updatedAt: row.updated_at as string,
  };
}

function parseHighlight(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    bookId: row.book_id as number,
    page: row.page as number | null,
    quote: row.quote as string,
    annotation: (row.annotation as string) || undefined,
  };
}

export { parseTags, parseBook, parseNote, parseHighlight };
