"use client";

import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Header, Footer, ErrorMessage, SuccessMessage, LoadingSpinner } from "../components/shared";

const AlbumCard = ({ album, onSave, loading = false }) => (
  <div className="group">
    <div className="aspect-square bg-[#131b26] border border-[#1e293b] rounded overflow-hidden mb-2 hover:border-[#87ceeb] transition-all">
      <img src={album.coverUrl || '/placeholder.jpg'} alt={album.title} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xs md:text-sm font-medium text-[#f0f9ff] truncate">{album.title}</h3>
    <p className="text-[10px] md:text-xs text-stone-400 truncate">{album.artist}</p>
    {onSave && (
      <button
        onClick={() => onSave(album)}
        disabled={loading}
        className="mt-2 w-full text-[10px] md:text-xs bg-[#87ceeb] text-[#0a0f16] py-1.5 font-bold hover:bg-white disabled:opacity-50 rounded transition-all"
      >
        {loading ? 'guardando...' : 'guardar'}
      </button>
    )}
  </div>
);

export default function BuscarPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) {
      setError("Mínimo 2 caracteres");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await api.searchAlbums(query);
      setResultados(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        setError("No se encontraron resultados");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al conectar");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleGuardar = async (album) => {
    if (!user) {
      setError("Inicia sesión para guardar");
      setTimeout(() => router.push("/auth/login"), 1500);
      return;
    }

    setSavingId(album.id);
    try {
      await api.registerListen(album.id, user.id, null, null);
      setNotification(`${album.title} guardado`);
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al guardar");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f16]">
      <Header user={user} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6 md:py-12">
        <form onSubmit={handleSearch} className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar álbum..."
            className="w-full max-w-md"
            autoFocus
          />
        </form>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
        {notification && <SuccessMessage message={notification} />}

        {loading && <LoadingSpinner message="Buscando..." />}

        {!loading && searched && resultados.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {resultados.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onSave={handleGuardar}
                loading={savingId === album.id}
              />
            ))}
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-20 text-stone-400">Escribe para buscar</div>
        )}

        {!loading && searched && resultados.length === 0 && !error && (
          <div className="text-center py-20 text-stone-400">No hay resultados para "{query}"</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
