// tornamesa-frontend/src/app/page.js

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  Header,
  Footer,
  LoadingSpinner,
  AlbumCard,
  StatsCard,
  RatingStars
} from '@/components/shared';

// 🎯 LANDING VIEW
function LandingView() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-0 min-h-[60vh]">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[#f0f9ff] lowercase mb-2">
            tornamesa
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            Letterboxd para música
          </p>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-light text-stone-400 leading-relaxed">
          Registra los discos que escuchas.
          <br />
          Guarda tus favoritos.
          <br />
          Dile a tus amigos qué estás oyendo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/register"
            className="inline-block bg-[#87ceeb] text-[#0a0f16] px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold hover:bg-white transition-all text-sm sm:text-base"
          >
            Empezar ahora
          </Link>
          <Link
            href="/login"
            className="inline-block border border-[#1e293b] text-stone-400 px-6 sm:px-8 py-2.5 sm:py-3 rounded hover:text-[#87ceeb] hover:border-[#87ceeb] transition-all text-sm sm:text-base"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

// 📊 DASHBOARD VIEW
function DashboardView({ historial, stats }) {
  const [topAlbums, setTopAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (historial && historial.length > 0) {
      const albumCounts = {};
      const albumDetails = {};

      historial.forEach(item => {
        const album = item.albums;
        if (album) {
          albumCounts[album.spotify_id] = (albumCounts[album.spotify_id] || 0) + 1;
          albumDetails[album.spotify_id] = album;
        }
      });

      const sorted = Object.entries(albumCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([id, count]) => ({
          ...albumDetails[id],
          plays: count
        }));

      setTopAlbums(sorted);
    }
    setLoading(false);
  }, [historial]);

  if (loading) return <LoadingSpinner message="Cargando tu actividad..." />;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16">
      {/* Stats Section */}
      <section className="space-y-4">
        <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest">
          Tu Actividad
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            label="Álbumes Escuchados"
            value={stats.totalAlbumsListened || 0}
          />
          <StatsCard
            label="Minutos Escuchados"
            value={Math.round(stats.totalMinutesSpended / 60) || 0}
            unit="h"
          />
          <StatsCard
            label="Esta Semana"
            value={historial.filter(item => {
              const date = new Date(item.listened_at);
              const week = new Date();
              week.setDate(week.getDate() - 7);
              return date > week;
            }).length}
            isHidden="hidden md:block"
          />
        </div>
      </section>

      {/* Top Albums Section */}
      <section className="space-y-4">
        <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest">
          Tus Favoritos
        </h2>
        {topAlbums.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {topAlbums.map(album => (
              <div key={album.spotify_id} className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#131b26] border border-[#1e293b] group hover:border-[#87ceeb] transition-all">
                  <img
                    src={album.cover_url || '/placeholder.jpg'}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#87ceeb] text-[#0a0f16] text-xs font-bold px-2 py-1 rounded">
                    {album.plays}
                  </div>
                </div>
                <div className="min-h-10">
                  <p className="text-xs sm:text-sm font-medium text-[#f0f9ff] line-clamp-2">
                    {album.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-stone-400 line-clamp-1">
                    {album.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm mb-4">
              Aún no tienes escuchas registradas
            </p>
            <Link
              href="/buscar"
              className="inline-block bg-[#87ceeb] text-[#0a0f16] px-4 py-2 rounded text-sm font-bold hover:bg-white transition-all"
            >
              Buscar álbumes
            </Link>
          </div>
        )}
      </section>

      {/* Recent Listens Section */}
      {historial.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest">
            Escuchas Recientes
          </h2>
          <div className="space-y-2">
            {historial.slice(0, 10).map(item => (
              <div
                key={item.id}
                className="bg-[#131b26] border border-[#1e293b] rounded p-3 sm:p-4 flex items-start gap-3 hover:border-[#87ceeb] transition-all"
              >
                <img
                  src={item.albums?.cover_url || '/placeholder.jpg'}
                  alt={item.albums?.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-[#f0f9ff] truncate">
                    {item.albums?.title || 'Desconocido'}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-400 truncate">
                    {item.albums?.artist || 'Artista desconocido'}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {item.rating && (
                    <div className="text-yellow-400 text-lg">
                      {'★'.repeat(item.rating)}
                    </div>
                  )}
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(item.listened_at).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

// ==================== MAIN PAGE ====================
export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [stats, setStats] = useState({
    totalAlbumsListened: 0,
    totalMinutesSpended: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getUserHistory(user.id);
        if (data) {
          setHistorial(data.history || []);
          setStats(data.stats || {});
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
        <Header />
        <LoadingSpinner message="Cargando tu dashboard..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] font-sans flex flex-col">
      <Header />
      {user ? (
        <DashboardView historial={historial} stats={stats} />
      ) : (
        <LandingView />
      )}
      <Footer />
    </div>
  );
}
