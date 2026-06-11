import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LibraryPage } from './pages/LibraryPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { useLibraryStore } from './stores/libraryStore';
import { useBookDetailStore } from './stores/bookDetailStore';
import './styles/global.css';

type Route = { view: 'library' } | { view: 'detail'; bookId: number };

function App() {
  const [route, setRoute] = useState<Route>({ view: 'library' });
  const theme = useLibraryStore((s) => s.theme);
  const resetDetail = useBookDetailStore((s) => s.reset);

  const openDetail = (bookId: number) => setRoute({ view: 'detail', bookId });
  const goBack = () => {
    resetDetail();
    setRoute({ view: 'library' });
  };

  const className = theme === 'dark' ? 'dark min-h-screen' : 'min-h-screen bg-gray-50 text-gray-900';

  return (
    <div className={className}>
      {route.view === 'library' && <LibraryPage onOpenBook={openDetail} />}
      {route.view === 'detail' && <BookDetailPage bookId={route.bookId} onBack={goBack} />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
