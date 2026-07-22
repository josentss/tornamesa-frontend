// tornamesa-frontend/src/app/auth/login/page.js

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ErrorMessage, LoadingSpinner } from '@/components/shared';

export default function LoginPage() {
  const { signIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    if (!password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex items-center justify-center">
        <LoadingSpinner message="Verificando sesión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-[#f0f9ff] lowercase mb-2">
            tornamesa
          </h1>
          <p className="text-sm text-stone-400">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-xs sm:text-sm text-stone-400 font-semibold block mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-xs sm:text-sm text-stone-400 font-semibold block mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#87ceeb] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.26 3.64m-5.88 5.88a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#87ceeb] text-[#0a0f16] py-2.5 rounded-lg font-bold text-sm hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1e293b]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#0a0f16] text-stone-500">o</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-stone-400">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-[#87ceeb] hover:text-white font-semibold transition-colors">
              Registrarse
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center text-xs text-stone-500">
          <Link href="/" className="hover:text-[#87ceeb] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
