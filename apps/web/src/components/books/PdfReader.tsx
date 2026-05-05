import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { BookItem } from '../../lib/books/types';
import { getBookProgressKey } from '../../lib/books/storage';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type Props = {
  book: BookItem;
  url: string;
};

export default function PdfReader({ book, url }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(860);
  const [page, setPage] = useState(() => Number(localStorage.getItem(`${getBookProgressKey(book.id)}:page`) || 1));

  useEffect(() => {
    if (!shellRef.current) return;
    const resize = () => setWidth(Math.min(920, Math.max(280, shellRef.current?.clientWidth ? shellRef.current.clientWidth - 40 : 860)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);

  const setCurrentPage = (next: number) => {
    const value = Math.max(1, Math.min(next, numPages || next));
    setPage(value);
    localStorage.setItem(`${getBookProgressKey(book.id)}:page`, String(value));
    localStorage.setItem(
      getBookProgressKey(book.id),
      JSON.stringify({
        page: value,
        percent: numPages ? value / numPages : 0,
        updatedAt: Date.now()
      })
    );
  };

  return (
    <section className="pdf-reader" ref={shellRef}>
      <div className="pdf-controls">
        <button type="button" onClick={() => setCurrentPage(page - 1)} disabled={page <= 1}>
          <ChevronLeft aria-hidden="true" size={16} />
          上一页
        </button>
        <span>
          {page} / {numPages || '?'}
        </span>
        <button type="button" onClick={() => setCurrentPage(page + 1)} disabled={Boolean(numPages) && page >= numPages}>
          下一页
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>

      <Document
        file={url}
        loading={<p className="pdf-reader__status">正在载入 PDF。</p>}
        error={<p className="pdf-reader__status">PDF 载入失败，请检查 OpenList raw_url 是否可公开访问。</p>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={page} width={width} />
      </Document>
    </section>
  );
}
