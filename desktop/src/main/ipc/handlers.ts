import { ipcMain } from 'electron';
import { repository } from '../database/repository.js';

export function registerIpcHandlers(): void {
  ipcMain.handle('books:list', () => repository.listBooks());
  ipcMain.handle('books:create', (_event, book) => repository.createBook(book));
  ipcMain.handle('books:detail', (_event, id: number) => repository.getBook(id));
  ipcMain.handle('notes:byBook', (_event, bookId: number) => repository.listNotesByBook(bookId));
  ipcMain.handle('highlights:byBook', (_event, bookId: number) => repository.listHighlightsByBook(bookId));
  ipcMain.handle('notes:list', () => repository.listNotes());
  ipcMain.handle('notes:save', (_event, note) => repository.saveNote(note));
  ipcMain.handle('highlights:list', () => repository.listHighlights());
  ipcMain.handle('highlights:create', (_event, highlight) => repository.createHighlight(highlight));
}
