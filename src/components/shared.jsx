// tornamesa-frontend/src/components/shared.jsx

'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 🎨 HEADER REUSABLE
export function Header({ currentPage = 'home' }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setShowMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full bg-[#0a0f16] border-b border-[#1e293b] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold tracking-tighter text-[#f0f9ff] lowercase">
              🎵 tornamesa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link href="/buscar" className="text-sm text-stone-400 hover:text-[#87ceeb] transition-colors">
                  Buscar
                </Link>
                <Link href={`/${user.email.split('@')[0]}`} className="text-sm text-stone-400 hover:text-[#87ceeb] transition-colors">
                  Mi Perfil
                </Link>
                <Link href="/settings" className="text-sm text-stone-400 hover:text-[#87ceeb] transition-colors">
                  Configuración
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center text-xs font-bold text-[#87ceeb] hover:border-[#87ceeb] transition-all"
                  title={user.email}
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#131b26] border border-[#1e293b] rounded shadow-lg">
                    <div className="p-3 border-b border-[#1e293b]">
                      <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>

                    {/* Mobile menu items */}
                    <div className="md:hidden p-2 space-y-2">
                      <Link
                        href="/buscar"
                        className="block text-sm text-stone-400 hover:text-[#87ceeb] px-3 py-2 rounded hover:bg-[#1e293b] transition-all"
                        onClick={() => setShowMenu(false)}
                      >
                        Buscar
                      </Link>
                      <Link
                        href={`/${user.email.split('@')[0]}`}
                        className="block text-sm text-stone-400 hover:text-[#87ceeb] px-3 py-2 rounded hover:bg-[#1e293b] transition-all"
                        onClick={() => setShowMenu(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/settings"
                        className="block text-sm text-stone-400 hover:text-[#87ceeb] px-3 py-2 rounded hover:bg-[#1e293b] transition-all"
                        onClick={() => setShowMenu(false)}
                      >
                        Configuración
                      </Link>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2 hover:bg-[#1e293b] transition-all"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2 text-stone-400 border border-[#1e293b] rounded hover:text-[#87ceeb] hover:border-[#87ceeb] transition-all"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-[#87ceeb] text-[#0a0f16] rounded font-bold hover:bg-white transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// 📄 FOOTER REUSABLE
export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] mt-auto bg-[#0a0f16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs sm:text-sm text-stone-500">
            © 2026 tornamesa • Letterboxd para música
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-stone-500">
            <a href="#" className="hover:text-[#87ceeb] transition-colors">
              Acerca
            </a>
            <a href="#" className="hover:text-[#87ceeb] transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ⏳ LOADING SPINNER
export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#1e293b]"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-[#87ceeb] animate-spin"></div>
      </div>
      <p className="text-sm text-stone-400">{message}</p>
    </div>
  );
}

// ⚠️ ERROR MESSAGE
export function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm flex justify-between items-center">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-300 hover:text-red-200 text-lg"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ✅ SUCCESS MESSAGE
export function SuccessMessage({ message, onDismiss, autoClose = 3000 }) {
  React.useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(onDismiss, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onDismiss]);

  return (
    <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded text-green-300 text-sm flex justify-between items-center">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-300 hover:text-green-200 text-lg"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// 🎨 ALBUM CARD
export function AlbumCard({ album, onSave, loading = false }) {
  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-square w-full bg-[#131b26] rounded-lg border border-[#1e293b] overflow-hidden group-hover:border-[#87ceeb] transition-all duration-300">
        <img
          src={album.coverUrl || '/placeholder.jpg'}
          alt={album.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="w-full">
            <h3 className="text-sm font-bold text-[#f0f9ff] leading-tight mb-1">
              {album.title}
            </h3>
            <p className="text-xs text-stone-300 mb-3">
              {album.artist}
            </p>
            {onSave && (
              <button
                onClick={() => onSave(album)}
                disabled={loading}
                className="w-full bg-[#87ceeb] text-[#0a0f16] text-xs font-bold py-2 rounded hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : '+ Loguear'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-xs sm:text-sm font-medium text-[#f0f9ff] line-clamp-2 group-hover:text-[#87ceeb] transition-colors">
          {album.title}
        </h3>
        <p className="text-xs text-stone-400 line-clamp-1">
          {album.artist}
        </p>
      </div>
    </div>
  );
}

// ⭐ RATING STARS
export function RatingStars({ rating = 0, onRate, interactive = false, size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={`${sizes[size]} ${
            star <= rating ? 'text-[#FFF096]' : 'text-stone-600'
          } ${interactive ? 'cursor-pointer hover:text-[#FFF096]' : 'cursor-default'} transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// 📊 STATS CARD
export function StatsCard({ label, value, unit = '' }) {
  return (
    <div className="bg-[#131b26] border border-[#1e293b] rounded-lg p-4">
      <p className="text-xs sm:text-sm text-stone-500 font-semibold mb-2 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-[#87ceeb]">
        {value}
        {unit && <span className="text-lg text-stone-400 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

export default {
  Header,
  Footer,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
  AlbumCard,
  RatingStars,
  StatsCard
};
