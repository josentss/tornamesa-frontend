// tornamesa-frontend/src/app/buscar/page.js

'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Header,
  Footer,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
  AlbumCard
} from '@/components/shared';

export default function BuscarPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) {
      setError('Busca debe tener al menos 2 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await api.searchAlbums(query);
      setResultados(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        setError('No se encontraron álbumes. Intenta con otro término.');
      }
    } catch (err) {
      setError(err.message || 'Error al buscar álbumes');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleGuardar = async (album) => {
    if (!user) {
      setError('Debes iniciar sesión para guardar escuchas');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setSavingId(album.id);
    try {
      await api.registerListen(album.id, user.id, null, null);
      setNotification(`✓ Guardado: ${album.title}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] font-sans flex flex-col">
      <Header currentPage="buscar" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Barra de Búsqueda */}
        <div className="mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar álbumes, artistas..."
                className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87ceeb] hover:text-white disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>

          <p className="text-xs sm:text-sm text-stone-500 mt-3">
            💡 Prueba: "Pink Floyd", "The Beatles", "Kendrick Lamar"
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {notification && (
          <SuccessMessage
            message={notification}
            onDismiss={() => setNotification(null)}
            autoClose={3000}
          />
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner message="Buscando álbumes..." />}

        {/* Resultados Grid */}
        {!loading && searched && resultados.length > 0 && (
          <div>
            <p className="text-sm text-stone-400 mb-6">
              Se encontraron <span className="text-[#87ceeb] font-bold">{resultados.length}</span> álbumes
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {resultados.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onSave={handleGuardar}
                  loading={savingId === album.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && resultados.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="text-4xl sm:text-6xl mb-4">🎵</div>
            <p className="text-lg sm:text-xl text-stone-400 mb-2">Busca tu álbum favorito</p>
            <p className="text-sm text-stone-500">
              Escribe el nombre de un artista o álbum para comenzar
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && resultados.length === 0 && !error && (
          <div className="text-center py-12 sm:py-20">
            <div className="text-3xl mb-4">🔍</div>
            <p className="text-lg text-stone-400">
              No encontramos resultados para "{query}"
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
