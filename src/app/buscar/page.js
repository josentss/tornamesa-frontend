"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function BuscarPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ text: "", type: "" });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCargando(true);
    setNotificacion({ text: "", type: "" });
    try {
      const data = await api.searchAlbums(query);
      setResultados(Array.isArray(data) ? data : data.albums || []);
    } catch (err) {
      setNotificacion({ text: "Error buscando álbumes.", type: "error" });
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (album) => {
    if (!user) {
      setNotificacion({ text: "Debes iniciar sesión para guardar.", type: "error" });
      return;
    }

    try {
      await api.registerListen(album.id, user.id, 5, "Añadido desde búsqueda");
      setNotificacion({ text: `Guardado: ${album.title}`, type: "success" });
      setTimeout(() => setNotificacion({ text: "", type: "" }), 3000);
    } catch (e) {
      setNotificacion({ text: "Error al guardar el álbum.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] px-4 md:px-6 py-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 border-b border-[#1e293b] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-[#f0f9ff] lowercase">tornamesa</Link>
          <nav className="flex gap-6 text-sm text-stone-400">
            <span className="text-[#87ceeb] font-semibold border-b border-[#87ceeb] pb-1">Buscar</span>
            <Link href="/settings" className="hover:text-[#f0f9ff] transition-colors pb-1">Perfil</Link>
          </nav>
        </header>

        <form onSubmit={handleSearch} className="mb-8 max-w-lg relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar álbumes o artistas..."
            className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded px-4 py-3 md:py-4 text-sm focus:border-[#87ceeb] outline-none transition-all disabled:opacity-50"
            disabled={cargando}
          />
          {cargando && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500">Buscando...</span>}
        </form>

        {notificacion.text && (
          <div className={`mb-6 text-sm p-3 rounded border ${notificacion.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#87ceeb]/10 border-[#87ceeb]/20 text-[#87ceeb]'}`}>
            {notificacion.text}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {resultados.map((album) => (
            <div key={album.id} className="group relative flex flex-col">
              <div className="aspect-square bg-[#131b26] rounded shadow-lg overflow-hidden border border-[#1e293b] group-hover:border-[#87ceeb] transition-all duration-300">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px]">Sin Portada</div>
                )}
              </div>
              <div className="mt-2 text-left">
                <h3 className="text-[11px] md:text-sm font-medium truncate group-hover:text-[#87ceeb] transition-colors">{album.title}</h3>
                <button
                  onClick={() => handleGuardar(album)}
                  className="mt-1 text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#87ceeb] transition-colors"
                >
                  + Loguear
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
