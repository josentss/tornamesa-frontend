// tornamesa-frontend/src/app/[username]/page.js

'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  Header,
  Footer,
  LoadingSpinner,
  ErrorMessage,
  StatsCard
} from '@/components/shared';

// 📊 RATING HISTOGRAM
function RatingHistogram({ distribution }) {
  const max = Math.max(
    distribution['5'] || 0,
    distribution['4'] || 0,
    distribution['3'] || 0,
    distribution['2'] || 0,
    distribution['1'] || 0,
    1
  );

  const ratings = [5, 4, 3, 2, 1];
  const colors = ['#FFF096', '#87ceeb', '#00e054', '#f97316', '#e11d48'];

  return (
    <div className="space-y-3">
      {ratings.map((rating, idx) => (
        <div key={rating} className="flex items-center gap-4">
          <div className="flex items-center gap-1 w-12">
            {'★'.repeat(rating)}
            <span className="text-xs text-stone-500">{rating}</span>
          </div>
          <div className="flex-1">
            <div className="h-6 bg-[#1e293b] rounded overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${((distribution[rating] || 0) / max) * 100}%`,
                  backgroundColor: colors[idx]
                }}
              ></div>
            </div>
          </div>
          <div className="w-12 text-right text-xs text-stone-400 font-semibold">
            {distribution[rating] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}

// 🎵 LISTEN ITEM
function ListenItem({ item }) {
  return (
    <div className="bg-[#131b26] border border-[#1e293b] rounded-lg p-4 flex gap-4 hover:border-[#87ceeb] transition-all">
      <img
        src={item.albums?.cover_url || '/placeholder.jpg'}
        alt={item.albums?.title}
        className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#f0f9ff] truncate">
          {item.albums?.title || 'Desconocido'}
        </h4>
        <p className="text-sm text-stone-400 truncate">
          {item.albums?.artist || 'Artista desconocido'}
        </p>
        <p className="text-xs text-stone-500 mt-1">
          {new Date(item.listened_at).toLocaleDateString('es-ES', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
      {item.rating && (
        <div className="flex-shrink-0 text-right">
          <div className="text-[#FFF096] text-lg">
            {'★'.repeat(item.rating)}
          </div>
        </div>
      )}
      {item.review && (
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-stone-300 rounded-b" title={item.review}>
          {item.review}
        </div>
      )}
    </div>
  );
}

// ==================== PAGE COMPONENT ====================
export default function UserProfilePage({ params }) {
  const { username } = params;
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileData, historyData] = await Promise.all([
          api.getPublicProfile(username),
          api.getPublicHistory(username, 50)
        ]);

        setProfile(profileData);
        setHistory(historyData || []);
      } catch (err) {
        setError('Usuario no encontrado');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
        <Header />
        <LoadingSpinner message="Cargando perfil..." />
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
          <ErrorMessage message={error || 'Perfil no encontrado'} />
          <Link
            href="/"
            className="mt-6 inline-block bg-[#87ceeb] text-[#0a0f16] px-6 py-3 rounded font-bold hover:bg-white transition-all"
          >
            Volver al Inicio
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = profile.stats || {
    totalAlbumsListened: 0,
    totalMinutesSpended: 0,
    ratingsDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
    averageRating: 0
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16">
        {/* Profile Header */}
        <section className="border-b border-[#1e293b] pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-[#131b26] border-2 border-[#1e293b] flex items-center justify-center text-4xl sm:text-6xl font-bold text-[#87ceeb]">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#f0f9ff]">
                @{profile.username}
              </h1>
              {profile.bio && (
                <p className="text-stone-400 mt-2 text-sm sm:text-base max-w-2xl">
                  {profile.bio}
                </p>
              )}
              <p className="text-xs text-stone-500 mt-3">
                Se unió en {new Date(profile.created_at).toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section>
          <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              label="Álbumes"
              value={stats.totalAlbumsListened || 0}
            />
            <StatsCard
              label="Horas"
              value={Math.round(stats.totalMinutesSpended / 60) || 0}
            />
            <StatsCard
              label="Rating Promedio"
              value={stats.averageRating || '0'}
            />
            <StatsCard
              label="Minutos"
              value={stats.totalMinutesSpended || 0}
            />
          </div>
        </section>

        {/* Rating Distribution */}
        {stats.ratingsDistribution && Object.values(stats.ratingsDistribution).some(v => v > 0) && (
          <section className="bg-[#131b26] border border-[#1e293b] rounded-lg p-6">
            <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest mb-6">
              Distribución de Calificaciones
            </h2>
            <RatingHistogram distribution={stats.ratingsDistribution} />
          </section>
        )}

        {/* Recent Listens */}
        {history.length > 0 && (
          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
              Escuchas Recientes
            </h2>
            <div className="grid gap-4">
              {history.map(item => (
                <ListenItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <section className="text-center py-12">
            <div className="text-4xl sm:text-6xl mb-4">🎵</div>
            <p className="text-lg text-stone-400">
              @{profile.username} aún no tiene escuchas registradas
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
