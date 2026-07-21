"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext"; // Importamos el contexto

export default function BuscarPage() {
  const { user } = useAuth(); // Obtenemos el usuario autenticado
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCargando(true);
    try {
      const data = await api.searchAlbums(query);
      setResultados(Array.isArray(data) ? data : data.albums || []);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (album) => {
    // Verificamos que el usuario esté logueado antes de guardar
    if (!user) {
      setNotificacion("Debes iniciar sesión para guardar.");
      return;
    }

    try {
      // Usamos user.id en lugar del ID fijo anterior
      await api.registerListen(album.id, user.id, 5, "Añadido desde búsqueda");
      setNotificacion(`Guardado: ${album.title}`);
      setTimeout(() => setNotificacion(""), 3000);
    } catch (e) {
      setNotificacion("Error al guardar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-12 border-b border-[#1e293b] pb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter text-[#f0f9ff] lowercase">tornamesa</h1>
          <nav className="flex gap-8 text-sm text-stone-400">
            <span className="text-[#87ceeb] font-semibold border-b border-[#87ceeb]">Buscar</span>
            <a href="/historial" className="hover:text-[#f0f9ff] transition-colors">Perfil</a>
          </nav>
        </header>

        <form onSubmit={handleSearch} className="mb-10 max-w-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar álbumes..."
            className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded px-4 py-3 text-sm focus:border-[#87ceeb] outline-none transition-all"
          />
        </form>

        {notificacion && <div className="mb-6 text-sm text-[#87ceeb]">{notificacion}</div>}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {resultados.map((album) => (
            <div key={album.id} className="group relative flex flex-col">
              <div className="aspect-square bg-[#131b26] rounded shadow-lg overflow-hidden border border-[#1e293b] group-hover:border-[#87ceeb] transition-all duration-300">
                <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2 text-left">
                <h3 className="text-sm font-medium truncate group-hover:text-[#87ceeb]">{album.title}</h3>
                <button
                  onClick={() => handleGuardar(album)}
                  className="mt-1 text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#87ceeb] transition-colors"
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
