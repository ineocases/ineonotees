import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eraser, Highlighter, Minus, Pen, Redo2, Undo2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { savePage, subscribeNotebooks, subscribePages } from "../services/notebookService";
import type { Notebook, Page, Point, Stroke } from "../types/models";

const colors = ["#111111", "#d12f2f", "#2463eb", "#198754", "#9b59b6", "#f59e0b"];

export default function Editor() {
  const { notebookId } = useParams();
  const user = useAuth()!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [page, setPage] = useState<Page | null>(null);
  const [tool, setTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [color, setColor] = useState("#111111");
  const [width, setWidth] = useState(3);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [future, setFuture] = useState<Stroke[][]>([]);
  const currentPoints = useRef<Point[]>([]);

  useEffect(() => {
    if (!notebookId) return;
    const unsubN = subscribeNotebooks(user.uid, items => setNotebook(items.find(x => x.id === notebookId) ?? null));
    const unsubP = subscribePages(user.uid, notebookId, items => {
      setPages(items);
      setPage(current => items.find(p => p.id === current?.id) ?? items[0] ?? null);
    });
    return () => { unsubN(); unsubP(); };
  }, [user.uid, notebookId]);

  useEffect(() => {
    if (!page || !canvasRef.current) return;
    draw(page.strokes);
  }, [page]);

  function canvasPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height, pressure: e.pressure || 0.5 };
  }

  function draw(strokes: Stroke[]) {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of strokes) {
      if (s.points.length < 2) continue;
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = s.tool === "highlighter" ? "multiply" : "source-over";
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (const p of s.points.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!page) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    currentPoints.current = [canvasPoint(e)];
    const old = page.strokes;
    setHistory(h => [...h.slice(-29), old]);
    setFuture([]);
    if (tool === "eraser") {
      const point = canvasPoint(e);
      const radius = Math.max(width * 3, 18);
      const remaining = old.filter(stroke => !stroke.points.some(p => Math.hypot(p.x - point.x, p.y - point.y) <= radius));
      setPage({ ...page, strokes: remaining, updatedAt: Date.now() });
      void savePage(user.uid, notebookId!, page.id, { strokes: remaining });
      drawingRef.current = false;
      return;
    }
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !page) return;
    currentPoints.current.push(canvasPoint(e));
    const preview = [...page.strokes, {
      id: crypto.randomUUID(),
      points: currentPoints.current,
      color,
      width,
      opacity: tool === "highlighter" ? 0.28 : 1,
      tool
    }];
    draw(preview);
  }

  async function pointerUp() {
    if (!drawingRef.current || !page) return;
    drawingRef.current = false;
    const stroke: Stroke = {
      id: crypto.randomUUID(),
      points: [...currentPoints.current],
      color,
      width,
      opacity: tool === "highlighter" ? 0.28 : 1,
      tool
    };
    const next = [...page.strokes, stroke];
    const nextPage = { ...page, strokes: next, updatedAt: Date.now() };
    setPage(nextPage);
    currentPoints.current = [];
    await savePage(user.uid, notebookId!, page.id, { strokes: next });
  }

  function undo() {
    if (!page || history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture(f => [page.strokes, ...f].slice(0, 30));
    setHistory(h => h.slice(0, -1));
    const next = { ...page, strokes: previous };
    setPage(next);
    savePage(user.uid, notebookId!, page.id, { strokes: previous });
  }

  function redo() {
    if (!page || future.length === 0) return;
    const nextStrokes = future[0];
    setHistory(h => [...h, page.strokes].slice(-30));
    setFuture(f => f.slice(1));
    setPage({ ...page, strokes: nextStrokes });
    savePage(user.uid, notebookId!, page.id, { strokes: nextStrokes });
  }

  if (!notebook || !page) return <div className="splash">Cargando cuaderno…</div>;

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <Link to="/" className="back"><ArrowLeft size={19}/></Link>
        <div><strong>{notebook.title}</strong><span>Página {page.pageNumber}</span></div>
        <div className="editor-top-actions"><button onClick={undo}><Undo2 size={18}/></button><button onClick={redo}><Redo2 size={18}/></button></div>
      </header>

      <main className="workspace">
        <aside className="page-strip">
          {pages.map(p => <button className={p.id === page.id ? "thumb active" : "thumb"} key={p.id} onClick={() => setPage(p)}>{p.pageNumber}</button>)}
        </aside>
        <div className={`paper-editor ${page.template}`}>
          <canvas ref={canvasRef} width={1200} height={1600}
            onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}/>
        </div>
      </main>

      <div className="toolbar">
        <button className={tool === "pen" ? "selected" : ""} onClick={() => setTool("pen")}><Pen size={19}/><span>Pluma</span></button>
        <button className={tool === "highlighter" ? "selected" : ""} onClick={() => setTool("highlighter")}><Highlighter size={19}/><span>Resaltar</span></button>
        <button className={tool === "eraser" ? "selected" : ""} onClick={() => setTool("eraser")}><Eraser size={19}/><span>Goma</span></button>
        <div className="colors">{colors.map(c => <button key={c} className={color === c ? "color active" : "color"} style={{background:c}} onClick={() => {setColor(c); setTool("pen")}}/>)}</div>
        <div className="width"><Minus size={14}/><input type="range" min="1" max="16" value={width} onChange={e => setWidth(Number(e.target.value))}/></div>
      </div>
    </div>
  );
}