// tornamesa-frontend/src/app/auth/register/page.js

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ErrorMessage, LoadingSpinner } from '@/components/shared';

export default function RegisterPage() {
  const { signUp, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (!agreed) {
      setError('Debes aceptar los términos de servicio');
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
      await signUp(email, password);
      // Mostrar mensaje de confirmación
      alert('¡Registro exitoso! Por favor verifica tu email para activar tu cuenta.');
      router.push('/auth/login');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
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
            Únete a la comunidad
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
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all"
              disabled={loading}
            />
            <p className="text-xs text-stone-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-xs sm:text-sm text-stone-400 font-semibold block mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all"
              disabled={loading}
            />
          </div>

          {/* Show Password */}
          <div className="flex items-center gap-2">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded accent-[#87ceeb]"
              disabled={loading}
            />
            <label htmlFor="showPassword" className="text-xs text-stone-400">
              Mostrar contraseña
            </label>
          </div>

          {/* Terms */}
          <div className="bg-[#131b26] border border-[#1e293b] rounded-lg p-4 space-y-3">
            <p className="text-xs text-stone-400">
              Al registrarte aceptas nuestros términos de servicio y política de privacidad.
            </p>
            <div className="flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded accent-[#87ceeb] mt-0.5"
                disabled={loading}
              />
              <label htmlFor="agree" className="text-xs text-stone-400">
                Acepto los términos de servicio y la política de privacidad
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-[#87ceeb] text-[#0a0f16] py-2.5 rounded-lg font-bold text-sm hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
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

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-stone-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-[#87ceeb] hover:text-white font-semibold transition-colors">
              Inicia sesión
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
