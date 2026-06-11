import { describe, it, expect } from 'vitest';
import { parseTags, parseBook, parseNote, parseHighlight } from '../src/main/database/rowParser.js';

describe('parseTags', () => {
  it('parses JSON string to array', () => {
    expect(parseTags('["文学/传记","历史"]')).toEqual(['文学/传记', '历史']);
  });

  it('parses empty JSON array string', () => {
    expect(parseTags('[]')).toEqual([]);
  });

  it('returns array as-is when already parsed', () => {
    expect(parseTags(['a', 'b'])).toEqual(['a', 'b']);
  });

  it('returns empty for invalid JSON string', () => {
    expect(parseTags('not-json')).toEqual([]);
  });

  it('returns empty for null/undefined', () => {
    expect(parseTags(null)).toEqual([]);
    expect(parseTags(undefined)).toEqual([]);
  });
});

describe('parseBook — simulates raw SQLite row', () => {
  it('parses full book row with JSON tags string', () => {
    const rawRow = {
      id: 1,
      title: '人类群星闪耀时',
      author: '斯蒂芬·茨威格',
      publisher: '生活读书新知三联书店',
      isbn: '9787108062437',
      cover: null,
      tags: '["文学/传记"]',
      status: 'reading',
      progress: 42,
      reading_minutes: 120,
    };

    const book = parseBook(rawRow);

    expect(book.id).toBe(1);
    expect(book.title).toBe('人类群星闪耀时');
    expect(book.author).toBe('斯蒂芬·茨威格');
    expect(book.publisher).toBe('生活读书新知三联书店');
    expect(book.isbn).toBe('9787108062437');
    expect(book.cover).toBeUndefined();
    expect(Array.isArray(book.tags)).toBe(true);
    expect(book.tags).toEqual(['文学/传记']);
    expect(book.tags.join('、')).toBe('文学/传记');
    expect(book.status).toBe('reading');
    expect(book.progress).toBe(42);
    expect(book.reading_minutes).toBe(120);
  });

  it('parses book with empty tags and empty-string optionals', () => {
    const rawRow = {
      id: 2,
      title: '测试书',
      author: '张三',
      publisher: '',
      isbn: '',
      cover: '',
      tags: '[]',
      status: 'want',
      progress: 0,
      reading_minutes: 0,
    };

    const book = parseBook(rawRow);

    expect(book.tags).toEqual([]);
    expect(book.publisher).toBeUndefined();
    expect(book.isbn).toBeUndefined();
    expect(book.cover).toBeUndefined();
  });
});

describe('parseNote — simulates raw SQLite row', () => {
  it('maps snake_case columns to camelCase and parses tags', () => {
    const rawRow = {
      id: 10,
      book_id: 1,
      title: '历史片段笔记',
      markdown: '## 摘要\n命运常在短时间内压缩成决定性瞬间。',
      tags: '["历史"]',
      updated_at: '2025-06-11T08:00:00.000Z',
    };

    const note = parseNote(rawRow);

    expect(note.id).toBe(10);
    expect(note.bookId).toBe(1);
    expect(note.title).toBe('历史片段笔记');
    expect(note.markdown).toContain('命运常在短时间内');
    expect(Array.isArray(note.tags)).toBe(true);
    expect(note.tags).toEqual(['历史']);
    expect(note.updatedAt).toBe('2025-06-11T08:00:00.000Z');
  });

  it('parses note with empty tags', () => {
    const rawRow = {
      id: 11,
      book_id: 2,
      title: '空标签笔记',
      markdown: 'content',
      tags: '[]',
      updated_at: '2025-06-11T09:00:00.000Z',
    };

    const note = parseNote(rawRow);

    expect(note.tags).toEqual([]);
  });
});

describe('parseHighlight — simulates raw SQLite row', () => {
  it('maps book_id to bookId and handles page + annotation', () => {
    const rawRow = {
      id: 5,
      book_id: 1,
      page: 32,
      quote: '一个真正具有世界历史意义的时刻。',
      annotation: '可作为开篇摘录。',
    };

    const hl = parseHighlight(rawRow);

    expect(hl.id).toBe(5);
    expect(hl.bookId).toBe(1);
    expect(hl.page).toBe(32);
    expect(hl.quote).toBe('一个真正具有世界历史意义的时刻。');
    expect(hl.annotation).toBe('可作为开篇摘录。');
  });

  it('handles null page and null annotation', () => {
    const rawRow = {
      id: 6,
      book_id: 2,
      page: null,
      quote: '无页码摘录',
      annotation: null,
    };

    const hl = parseHighlight(rawRow);

    expect(hl.page).toBeNull();
    expect(hl.annotation).toBeUndefined();
  });
});

describe('book detail page scenario — full data flow simulation', () => {
  it('parses a complete book detail: book + notes + highlights', () => {
    const rawBook = {
      id: 1,
      title: '人类群星闪耀时',
      author: '斯蒂芬·茨威格',
      publisher: '生活读书新知三联书店',
      isbn: '9787108062437',
      cover: null,
      tags: '["文学/传记"]',
      status: 'reading',
      progress: 42,
      reading_minutes: 120,
    };
    const rawNotes = [
      { id: 10, book_id: 1, title: '历史片段笔记', markdown: '## 摘要\n命运常在短时间内压缩成决定性瞬间。', tags: '["历史"]', updated_at: '2025-06-11T08:00:00.000Z' },
    ];
    const rawHighlights = [
      { id: 5, book_id: 1, page: 32, quote: '一个真正具有世界历史意义的时刻。', annotation: '可作为开篇摘录。' },
    ];

    const book = parseBook(rawBook);
    const notes = rawNotes.map(parseNote);
    const highlights = rawHighlights.map(parseHighlight);

    expect(book.title).toBe('人类群星闪耀时');
    expect(book.author).toBe('斯蒂芬·茨威格');
    expect(book.publisher).toBe('生活读书新知三联书店');
    expect(book.isbn).toBe('9787108062437');
    expect(book.status).toBe('reading');
    expect(book.progress).toBe(42);
    expect(book.reading_minutes).toBe(120);
    expect(book.tags.join('、')).toBe('文学/传记');

    expect(notes).toHaveLength(1);
    expect(notes[0].bookId).toBe(1);
    expect(notes[0].title).toBe('历史片段笔记');
    expect(notes[0].markdown).toContain('命运');
    expect(notes[0].tags).toEqual(['历史']);
    expect(notes[0].updatedAt).toBe('2025-06-11T08:00:00.000Z');

    expect(highlights).toHaveLength(1);
    expect(highlights[0].bookId).toBe(1);
    expect(highlights[0].page).toBe(32);
    expect(highlights[0].quote).toBe('一个真正具有世界历史意义的时刻。');
    expect(highlights[0].annotation).toBe('可作为开篇摘录。');
  });
});
