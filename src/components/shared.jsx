// tornamesa-frontend/src/components/shared.jsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// HEADER MINIMALISTA
export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="border-b border-[#1e293b] bg-[#0a0f16] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#f0f9ff]">
          tornamesa
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link href="/buscar" className="text-stone-400 hover:text-[#f0f9ff]">
                buscar
              </Link>
              <Link href={`/perfil/${user.email.split('@')[0]}`} className="text-stone-400 hover:text-[#f0f9ff]">
                perfil
              </Link>
              <Link href="/settings" className="text-stone-400 hover:text-[#f0f9ff]">
                configuración
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full bg-[#131b26] border border-[#1e293b] text-xs font-bold text-[#87ceeb]"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {showMenu && (
                  <button
                    onClick={handleSignOut}
                    className="absolute right-0 mt-2 px-4 py-2 bg-[#131b26] border border-[#1e293b] text-sm text-stone-400 hover:text-[#f0f9ff]"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-stone-400 hover:text-[#f0f9ff]">
                entrar
              </Link>
              <Link href="/auth/register" className="bg-[#87ceeb] text-[#0a0f16] px-3 py-1 rounded text-sm font-bold hover:bg-white">
                registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// FOOTER MINIMALISTA
export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] mt-12 py-6 bg-[#0a0f16]">
      <div className="max-w-7xl mx-auto px-4 text-xs text-stone-500 text-center">
        <p>© 2026 tornamesa</p>
      </div>
    </footer>
  );
}

// LOADING
export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="py-12 text-center text-stone-400">
      <p>{message}</p>
    </div>
  );
}

// ERROR
export function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-300 text-sm flex justify-between">
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} className="text-red-300">✕</button>}
    </div>
  );
}

// SUCCESS
export function SuccessMessage({ message }) {
  return (
    <div className="mb-4 p-3 bg-green-900/20 border border-green-800 text-green-300 text-sm">
      ✓ {message}
    </div>
  );
}

// ALBUM CARD MINIMALISTA
export function AlbumCard({ album, onSave, loading = false }) {
  return (
    <div className="group">
      <div className="aspect-square bg-[#131b26] border border-[#1e293b] overflow-hidden mb-2">
        <img
          src={album.coverUrl || '/placeholder.jpg'}
          alt={album.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-sm font-medium text-[#f0f9ff] truncate">
        {album.title}
      </h3>
      <p className="text-xs text-stone-400 truncate">
        {album.artist}
      </p>
      {onSave && (
        <button
          onClick={() => onSave(album)}
          disabled={loading}
          className="mt-2 w-full text-xs bg-[#87ceeb] text-[#0a0f16] py-1.5 font-bold hover:bg-white disabled:opacity-50"
        >
          {loading ? 'guardando...' : 'guardar'}
        </button>
      )}
    </div>
  );
}

// STATS CARD
export function StatsCard({ label, value }) {
  return (
    <div className="border border-[#1e293b] p-3">
      <p className="text-xs text-stone-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#87ceeb]">{value}</p>
    </div>
  );
}

export default { Header, Footer, LoadingSpinner, ErrorMessage, SuccessMessage, AlbumCard, StatsCard };
