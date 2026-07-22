// tornamesa-frontend/src/app/buscar/page.js

'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Header, Footer, ErrorMessage, SuccessMessage, AlbumCard, LoadingSpinner } from '@/components/shared';

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
      setError('Mínimo 2 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await api.searchAlbums(query);
      setResultados(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        setError('No se encontraron resultados');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleGuardar = async (album) => {
    if (!user) {
      setError('Inicia sesión para guardar');
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    setSavingId(album.id);
    try {
      await api.registerListen(album.id, user.id, null, null);
      setNotification(`${album.title} guardado`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al guardar');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
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

        {loading && <LoadingSpinner />}

        {!loading && searched && resultados.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
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
          <div className="text-center py-20 text-stone-400">
            <p>Escribe para buscar</p>
          </div>
        )}

        {!loading && searched && resultados.length === 0 && !error && (
          <div className="text-center py-20 text-stone-400">
            <p>No hay resultados para "{query}"</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
