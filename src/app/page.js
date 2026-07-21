"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import Link from "next/link";

const AmigoCard = ({ album, usuario }) => (
  <div className="group flex flex-col w-full">
    <div className="relative aspect-square w-full bg-[#131b26] rounded border border-[#1e293b] overflow-hidden transition-all duration-300">
      <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-3 flex flex-col justify-end">
        <h3 className="text-xs sm:text-sm font-bold text-[#f0f9ff] leading-tight truncate">{album.title}</h3>
        <p className="text-[9px] sm:text-[10px] text-stone-300 truncate">{album.artist}</p>
      </div>
    </div>
    <div className="mt-2 flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-[#1e293b] flex shrink-0 items-center justify-center text-[10px] font-bold text-[#87ceeb]">
        {usuario.charAt(0).toUpperCase()}
      </div>
      <span className="text-[11px] sm:text-xs text-stone-400 hover:text-[#f0f9ff] cursor-pointer transition-colors truncate">{usuario}</span>
    </div>
  </div>
);

const LandingView = () => (
  <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 text-center min-h-[60vh]">
    <div className="max-w-md space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#f0f9ff] lowercase mb-4">tornamesa</h1>
      <p className="text-lg md:text-xl font-light text-stone-400 leading-relaxed">
        Registra los discos que escuchas. <br />
        Guarda tus favoritos. <br />
        Dile a tus amigos qué estás oyendo.
      </p>
      <Link href="/register" className="inline-block bg-[#87ceeb] text-[#0a0f16] px-8 py-3 rounded font-bold hover:bg-white transition-all">
        Empezar ahora
      </Link>
    </div>
  </div>
);

const DashboardView = ({ historial, resumen }) => (
  <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12 space-y-12 w-full">
    <section>
      <h2 className="text-xs md:text-sm text-stone-500 font-bold mb-4 md:mb-6 uppercase tracking-wider">Lo que han escuchado tus amigos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {/* Aquí mapearás los amigos cuando tengas el endpoint listo */}
        <AmigoCard
            album={{title: "In Rainbows", artist: "Radiohead", coverUrl: "https://i.scdn.co/image/ab67616d0000b273b063231f24d7821611005a30"}}
            usuario="Santi"
        />
      </div>
    </section>

    <section className="bg-[#131b26] border border-[#1e293b] p-4 md:p-6 rounded shadow-lg overflow-hidden">
      <h2 className="text-xs md:text-sm text-[#87ceeb] font-bold mb-4 md:mb-6 uppercase tracking-wider">Tu actividad reciente</h2>
      {resumen.length > 0 ? (
        <div className="space-y-2">
          {resumen.map(([album, count]) => (
            <div key={album} className="flex justify-between items-center py-2 hover:bg-[#1e293b]/30 px-2 -mx-2 rounded transition-colors">
              <span className="text-xs md:text-sm font-medium text-[#f0f9ff] truncate mr-4">{album}</span>
              <span className="text-[#87ceeb] text-xs md:text-sm font-mono font-bold shrink-0">{count} reproducciones</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-500 text-sm italic">Aún no has registrado ninguna escucha. ¡Ve a buscar nueva música!</p>
      )}
    </section>
  </main>
);

export default function Page() {
  const { user, loading } = useAuth();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const data = await api.getUserHistory(user.id);
        setHistorial(Array.isArray(data) ? data : data.history || []);
      }
    }
    fetchData();
  }, [user]);

  const resumenOrdenado = Object.entries(historial.reduce((acc, item) => {
    const album = item.albums?.title || "Desconocido";
    acc[album] = (acc[album] || 0) + 1;
    return acc;
  }, {})).sort(([, a], [, b]) => b - a).slice(0, 5);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-500 bg-[#0a0f16]">Cargando...</div>;

  return (
    <div className="flex flex-col flex-1">
      <header className="w-full bg-[#0a0f16] border-b border-[#1e293b] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-[#f0f9ff]">
            Tornamesa
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/buscar" className="text-stone-400 hover:text-[#87ceeb] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>

            {user && (
              <Link href="/settings" className="w-8 h-8 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center hover:border-[#87ceeb] transition-colors">
                 <span className="text-xs font-bold text-[#87ceeb]">{user.email.charAt(0).toUpperCase()}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {user ? <DashboardView historial={historial} resumen={resumenOrdenado} /> : <LandingView />}

      <footer className="border-t border-[#1e293b] mt-auto py-6 bg-[#0a0f16]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} tornamesa</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#87ceeb] transition-colors">Acerca</Link>
            <Link href="#" className="hover:text-[#87ceeb] transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
