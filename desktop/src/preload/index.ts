import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('readingApi', {
  listBooks: () => ipcRenderer.invoke('books:list'),
  createBook: (book: unknown) => ipcRenderer.invoke('books:create', book),
  getBookDetail: (id: number) => ipcRenderer.invoke('books:detail', id),
  listNotes: () => ipcRenderer.invoke('notes:list'),
  listNotesByBook: (bookId: number) => ipcRenderer.invoke('notes:byBook', bookId),
  saveNote: (note: unknown) => ipcRenderer.invoke('notes:save', note),
  listHighlights: () => ipcRenderer.invoke('highlights:list'),
  listHighlightsByBook: (bookId: number) => ipcRenderer.invoke('highlights:byBook', bookId),
  createHighlight: (highlight: unknown) => ipcRenderer.invoke('highlights:create', highlight),
});
