import { create } from 'zustand';
import { Book, Highlight, Note } from '../types/domain';

type BookDetailState = {
  book: Book | null;
  notes: Note[];
  highlights: Highlight[];
  loading: boolean;
  loadDetail: (bookId: number) => Promise<void>;
  reset: () => void;
};

export const useBookDetailStore = create<BookDetailState>((set) => ({
  book: null,
  notes: [],
  highlights: [],
  loading: false,
  async loadDetail(bookId: number) {
    set({ loading: true });
    const [book, notes, highlights] = await Promise.all([
      window.readingApi.getBookDetail(bookId),
      window.readingApi.listNotesByBook(bookId),
      window.readingApi.listHighlightsByBook(bookId),
    ]);
    set({ book: book ?? null, notes, highlights, loading: false });
  },
  reset() {
    set({ book: null, notes: [], highlights: [], loading: false });
  },
}));
