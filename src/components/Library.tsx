import { useEffect, useMemo, useState } from "react";
import { BookOpen, FolderPlus, LogOut, Plus, Search, Star, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { createFolder, createNotebook, deleteNotebook, subscribeFolders, subscribeNotebooks, toggleFavorite } from "../services/notebookService";
import type { Folder, Notebook } from "../types/models";
import { logout } from "../services/authService";
import { Link } from "react-router-dom";

export default function Library() {
  const user = useAuth()!;
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const a = subscribeNotebooks(user.uid, setNotebooks);
    const b = subscribeFolders(user.uid, setFolders);
    return () => { a(); b(); };
  }, [user.uid]);

  const filtered = useMemo(() => notebooks.filter(n => n.title.toLowerCase().includes(search.toLowerCase())), [notebooks, search]);

  async function newNotebook() {
    const title = prompt("Nombre del cuaderno:", "Nuevo cuaderno");
    if (title?.trim()) await createNotebook(user.uid, title.trim());
  }

  async function newFolder() {
    const name = prompt("Nombre de la carpeta:", "Nueva carpeta");
    if (name?.trim()) await createFolder(user.uid, name.trim());
  }

  async function removeNotebook(n: Notebook) {
    if (confirm(`¿Eliminar "${n.title}"?`)) await deleteNotebook(user.uid, n.id);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span>✦</span> Notes</div>
        <div className="top-actions">
          <div className="search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar"/></div>
          <button className="icon-btn" title="Cerrar sesión" onClick={logout}><LogOut size={18}/></button>
        </div>
      </header>

      <main className="library">
        <section className="hero">
          <div><h2>Mis apuntes</h2><p>Hola, {user.displayName || user.email}</p></div>
          <div className="hero-buttons">
            <button onClick={newFolder} className="secondary"><FolderPlus size={17}/> Carpeta</button>
            <button onClick={newNotebook} className="primary small"><Plus size={17}/> Nuevo cuaderno</button>
          </div>
        </section>

        {folders.length > 0 && <section><h3>Carpetas</h3><div className="folders">{folders.map(f => <div className="folder" key={f.id}>📁 {f.name}</div>)}</div></section>}

        <section>
          <div className="section-title"><h3>Cuadernos</h3><span>{filtered.length}</span></div>
          <div className="notebook-grid">
            {filtered.map(n => (
              <div className="notebook-wrap" key={n.id}>
                <Link to={`/notebook/${n.id}`} className="notebook-card">
                  <div className={`paper ${n.template}`}><div className="mini-line">Notas</div><div className="mini-title">{n.title}</div></div>
                  <div className="notebook-info"><strong>{n.title}</strong><span>{n.pageCount} pág.</span></div>
                </Link>
                <div className="card-actions">
                  <button onClick={() => toggleFavorite(user.uid, n.id, !n.favorite)} title="Favorito"><Star size={15} fill={n.favorite ? "currentColor" : "none"}/></button>
                  <button onClick={() => removeNotebook(n)} title="Eliminar"><Trash2 size={15}/></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="empty"><BookOpen size={36}/><h3>No hay cuadernos</h3><p>Creá tu primer cuaderno para empezar.</p><button className="primary" onClick={newNotebook}><Plus size={17}/> Nuevo cuaderno</button></div>}
          </div>
        </section>
      </main>
    </div>
  );
}