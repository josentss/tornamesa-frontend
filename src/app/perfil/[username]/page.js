"use client";

import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";
import { Header, Footer, LoadingSpinner, ErrorMessage } from "../../../components/shared";

export default function UserProfilePage({ params }) {
  const { username } = params;
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("Error:", err);
        setError("Usuario no encontrado");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ErrorMessage message={error || "Perfil no encontrado"} />
            <Link href="/" className="bg-[#87ceeb] text-[#0a0f16] px-4 py-2 font-bold inline-block mt-4 hover:bg-white">
              Volver
            </Link>
          </div>
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
    <div className="flex flex-col min-h-screen bg-[#0a0f16]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6 md:py-12 space-y-8">
        {/* Header */}
        <div className="border-b border-[#1e293b] pb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center text-3xl font-bold text-[#87ceeb]">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">@{profile.username}</h1>
              {profile.bio && <p className="text-stone-400 mt-2 text-sm">{profile.bio}</p>}
              {profile.created_at && (
                <p className="text-xs text-stone-500 mt-2">
                  Se unió en {new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-[#1e293b] p-3 rounded">
            <p className="text-xs text-stone-500 mb-1">Álbumes</p>
            <p className="text-2xl font-bold text-[#87ceeb]">{stats.totalAlbumsListened || 0}</p>
          </div>
          <div className="border border-[#1e293b] p-3 rounded">
            <p className="text-xs text-stone-500 mb-1">Horas</p>
            <p className="text-2xl font-bold text-[#87ceeb]">{Math.round(stats.totalMinutesSpended / 60) || 0}</p>
          </div>
          <div className="border border-[#1e293b] p-3 rounded">
            <p className="text-xs text-stone-500 mb-1">Rating</p>
            <p className="text-2xl font-bold text-[#87ceeb]">{stats.averageRating || '0'}</p>
          </div>
          <div className="border border-[#1e293b] p-3 rounded">
            <p className="text-xs text-stone-500 mb-1">Minutos</p>
            <p className="text-2xl font-bold text-[#87ceeb]">{stats.totalMinutesSpended || 0}</p>
          </div>
        </div>

        {/* Rating Distribution */}
        {stats.ratingsDistribution && Object.values(stats.ratingsDistribution).some(v => v > 0) && (
          <div className="border border-[#1e293b] p-6 rounded">
            <h2 className="text-sm font-bold text-stone-500 mb-4">Calificaciones</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="text-xs font-bold text-[#FFF096]">{'★'.repeat(rating)}</div>
                  <div className="flex-1 h-4 bg-[#131b26] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#87ceeb]"
                      style={{
                        width: `${(stats.ratingsDistribution[rating] || 0) > 0 ? Math.min((stats.ratingsDistribution[rating] / stats.totalAlbumsListened) * 100, 100) : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-stone-500 w-8">{stats.ratingsDistribution[rating] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        {history.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-stone-500 mb-4">Escuchas recientes</h2>
            <div className="space-y-2">
              {history.map(item => (
                <div key={item.id} className="flex gap-3 border border-[#1e293b] p-3 rounded hover:border-[#87ceeb] transition-all">
                  <img src={item.albums?.cover_url} alt="" className="w-12 h-12 rounded flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f0f9ff] truncate">{item.albums?.title}</p>
                    <p className="text-xs text-stone-400">{item.albums?.artist}</p>
                  </div>
                  {item.rating && <div className="text-[#FFF096] text-sm">{'★'.repeat(item.rating)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400">Este usuario no tiene escuchas registradas</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
