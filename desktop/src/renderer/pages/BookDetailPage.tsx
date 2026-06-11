import { useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useBookDetailStore } from '../stores/bookDetailStore';

const STATUS_LABEL: Record<string, string> = { read: '已读', reading: '在读', want: '想读' };

export function BookDetailPage({ bookId, onBack }: { bookId: number; onBack: () => void }) {
  const { book, notes, highlights, loading, loadDetail } = useBookDetailStore();

  useEffect(() => {
    void loadDetail(bookId);
  }, [bookId, loadDetail]);

  if (loading) return <main className="min-h-screen p-6"><p>加载中…</p></main>;
  if (!book) return <main className="min-h-screen p-6"><p>未找到该书籍</p></main>;

  return (
    <main className="min-h-screen p-6">
      <button className="mb-4 rounded border px-3 py-1 text-sm" onClick={onBack}>← 返回书库</button>

      <section className="rounded border bg-white p-5 text-gray-900">
        <h1 className="text-2xl font-semibold">{book.title}</h1>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>作者：{book.author}</p>
          {book.publisher && <p>出版社：{book.publisher}</p>}
          {book.isbn && <p>ISBN：{book.isbn}</p>}
          <p>状态：{STATUS_LABEL[book.status] ?? book.status}</p>
          {book.progress != null && <p>进度：{book.progress}%</p>}
          {book.reading_minutes != null && <p>阅读时长：{book.reading_minutes} 分钟</p>}
          {book.tags.length > 0 && <p>标签：{book.tags.join('、')}</p>}
        </div>
      </section>

      <Tabs.Root defaultValue="notes" className="mt-5 rounded border bg-white p-4 text-gray-900">
        <Tabs.List className="mb-4 flex gap-2">
          <Tabs.Trigger value="notes">笔记（{notes.length}）</Tabs.Trigger>
          <Tabs.Trigger value="highlights">摘录（{highlights.length}）</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="notes" className="space-y-3">
          {notes.length === 0 && <p className="text-sm text-gray-400">暂无笔记</p>}
          {notes.map((note) => (
            <article key={note.id} className="rounded border p-3">
              <b className="text-sm">{note.title}</b>
              <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{note.markdown}</pre>
              {note.updatedAt && <p className="mt-1 text-xs text-gray-400">{note.updatedAt}</p>}
            </article>
          ))}
        </Tabs.Content>

        <Tabs.Content value="highlights" className="space-y-3">
          {highlights.length === 0 && <p className="text-sm text-gray-400">暂无摘录</p>}
          {highlights.map((item) => (
            <blockquote key={item.id} className="rounded border-l-4 border-emerald-500 bg-emerald-50 p-3">
              <p>{item.quote}</p>
              {item.annotation && <p className="mt-1 text-sm text-gray-600">{item.annotation}</p>}
              {item.page != null && <p className="mt-1 text-xs text-gray-400">第 {item.page} 页</p>}
            </blockquote>
          ))}
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
