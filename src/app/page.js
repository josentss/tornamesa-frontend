// tornamesa-frontend/src/app/page.js

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Header, Footer, LoadingSpinner } from '@/components/shared';

function LandingView() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center space-y-8">
        <h1 className="text-5xl font-bold text-[#f0f9ff]">tornamesa</h1>
        <p className="text-lg text-stone-400">
          Registra los discos que escuchas.<br />
          Guarda tus favoritos.<br />
          Comparte con tus amigos.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/register" className="bg-[#87ceeb] text-[#0a0f16] px-6 py-2 font-bold hover:bg-white">
            Empezar
          </Link>
          <Link href="/auth/login" className="border border-[#1e293b] text-stone-400 px-6 py-2 hover:border-[#87ceeb] hover:text-[#87ceeb]">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ historial, stats }) {
  const [topAlbums, setTopAlbums] = useState([]);

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
  }, [historial]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-[#1e293b] p-3">
          <p className="text-xs text-stone-500 mb-1">Álbumes</p>
          <p className="text-2xl font-bold text-[#87ceeb]">{stats.totalAlbumsListened || 0}</p>
        </div>
        <div className="border border-[#1e293b] p-3">
          <p className="text-xs text-stone-500 mb-1">Horas</p>
          <p className="text-2xl font-bold text-[#87ceeb]">{Math.round(stats.totalMinutesSpended / 60) || 0}</p>
        </div>
        <div className="border border-[#1e293b] p-3">
          <p className="text-xs text-stone-500 mb-1">Minutos</p>
          <p className="text-2xl font-bold text-[#87ceeb]">{stats.totalMinutesSpended || 0}</p>
        </div>
      </div>

      {/* Top Albums */}
      {topAlbums.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-stone-500 mb-4">Favoritos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {topAlbums.map(album => (
              <div key={album.spotify_id}>
                <div className="aspect-square bg-[#131b26] border border-[#1e293b] relative mb-2">
                  <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-[#87ceeb] text-[#0a0f16] text-xs font-bold px-2 py-0.5">
                    {album.plays}
                  </div>
                </div>
                <p className="text-xs font-medium text-[#f0f9ff] truncate">{album.title}</p>
                <p className="text-xs text-stone-400 truncate">{album.artist}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {historial.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-stone-500 mb-4">Recientes</h2>
          <div className="space-y-2">
            {historial.slice(0, 10).map(item => (
              <div key={item.id} className="flex gap-3 border border-[#1e293b] p-3 hover:border-[#87ceeb]">
                <img src={item.albums?.cover_url} alt="" className="w-10 h-10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f0f9ff] truncate">{item.albums?.title}</p>
                  <p className="text-xs text-stone-400">{item.albums?.artist}</p>
                </div>
                {item.rating && <div className="text-[#FFF096]">{'★'.repeat(item.rating)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {topAlbums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-400 mb-4">Aún no tienes escuchas registradas</p>
          <Link href="/buscar" className="bg-[#87ceeb] text-[#0a0f16] px-4 py-2 font-bold hover:bg-white inline-block">
            Buscar álbumes
          </Link>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getUserHistory(user.id);
        setHistorial(data.history || []);
        setStats(data.stats || {});
      } catch (error) {
        console.error('Error:', error);
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
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
      <Header />
      {user ? <DashboardView historial={historial} stats={stats} /> : <LandingView />}
      <Footer />
    </div>
  );
}
