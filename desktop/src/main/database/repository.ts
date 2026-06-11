import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'node:path';
import { schemaSql } from './schema.js';
import { parseBook, parseNote, parseHighlight } from './rowParser.js';

const dbPath = join(app.getPath('userData'), 'reading-notes.db');
const db = new Database(dbPath);
db.exec(schemaSql);

export const repository = {
  listBooks() {
    return db.prepare('SELECT * FROM books ORDER BY id DESC').all().map((row) => parseBook(row as Record<string, unknown>));
  },
  createBook(book: Record<string, unknown>) {
    const stmt = db.prepare('INSERT INTO books(title, author, publisher, isbn, cover, tags, status) VALUES(@title, @author, @publisher, @isbn, @cover, @tags, @status)');
    return stmt.run({ ...book, tags: JSON.stringify(book.tags ?? []), status: book.status ?? 'want' });
  },
  getBook(id: number) {
    const row = db.prepare('SELECT * FROM books WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? parseBook(row) : undefined;
  },
  listNotes() {
    return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all().map((row) => parseNote(row as Record<string, unknown>));
  },
  listNotesByBook(bookId: number) {
    return db.prepare('SELECT * FROM notes WHERE book_id = ? ORDER BY updated_at DESC').all(bookId).map((row) => parseNote(row as Record<string, unknown>));
  },
  saveNote(note: Record<string, unknown>) {
    return db.prepare('INSERT INTO notes(book_id, title, markdown, tags, updated_at) VALUES(@bookId, @title, @markdown, @tags, @updatedAt)').run({ ...note, tags: JSON.stringify(note.tags ?? []), updatedAt: new Date().toISOString() });
  },
  listHighlights() {
    return db.prepare('SELECT * FROM highlights ORDER BY id DESC').all().map((row) => parseHighlight(row as Record<string, unknown>));
  },
  listHighlightsByBook(bookId: number) {
    return db.prepare('SELECT * FROM highlights WHERE book_id = ? ORDER BY id DESC').all(bookId).map((row) => parseHighlight(row as Record<string, unknown>));
  },
  createHighlight(highlight: Record<string, unknown>) {
    return db.prepare('INSERT INTO highlights(book_id, page, quote, annotation) VALUES(@bookId, @page, @quote, @annotation)').run(highlight);
  },
};
