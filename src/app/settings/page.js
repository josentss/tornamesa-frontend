// tornamesa-frontend/src/app/settings/page.js

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  Header,
  Footer,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage
} from '@/components/shared';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos del perfil
  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await api.getUserProfile(user.id);
        if (data) {
          setUsername(data.username || '');
          setBio(data.bio || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, router]);

  const validateForm = () => {
    if (!username.trim()) {
      setError('El username es requerido');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      setError('Username debe tener 3-20 caracteres (letras, números, _ y -)');
      return false;
    }
    if (bio.length > 500) {
      setError('La biografía no puede exceder 500 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setSaving(true);
    try {
      await api.updateUserProfile(user.id, { username, bio });
      setSuccess('Perfil actualizado correctamente');

      // Redirigir al perfil público después de 2 segundos
      setTimeout(() => {
        router.push(`/${username}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        await signOut();
        router.push('/');
      } catch (err) {
        setError(err.message || 'Error al cerrar sesión');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
        <Header />
        <LoadingSpinner message="Verificando autenticación..." />
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex flex-col">
        <Header />
        <LoadingSpinner message="Cargando tu perfil..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-[#1e293b] pb-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#131b26] border-2 border-[#1e293b] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#87ceeb]">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f0f9ff]">
                  Configuración de Perfil
                </h1>
                <p className="text-sm text-stone-400 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="self-start sm:self-auto px-4 py-2 border border-red-800 text-red-400 rounded hover:bg-red-900/20 hover:text-red-300 transition-all text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Messages */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          {success && (
            <SuccessMessage
              message={success}
              autoClose={2000}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-xs sm:text-sm font-bold text-stone-400 uppercase tracking-wide block mb-3">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all"
                  placeholder="miusername"
                  required
                  disabled={saving}
                />
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Este será tu URL pública: tornamesa.app/<span className="text-[#87ceeb] font-bold">{username}</span>
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="text-xs sm:text-sm font-bold text-stone-400 uppercase tracking-wide block mb-3">
                Biografía
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#131b26] border border-[#1e293b] text-[#f0f9ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#87ceeb] focus:ring-1 focus:ring-[#87ceeb] placeholder-stone-500 transition-all resize-none"
                placeholder="Cuéntanos sobre ti, tus artistas favoritos..."
                rows={4}
                disabled={saving}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-stone-500">
                  Máximo 500 caracteres
                </p>
                <p className="text-xs text-stone-500">
                  {bio.length}/500
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#1e293b]">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#87ceeb] text-[#0a0f16] px-6 py-3 rounded-lg text-sm font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-[#1e293b] text-stone-400 px-6 py-3 rounded-lg text-sm font-bold hover:border-[#87ceeb] hover:text-[#87ceeb] transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* Preview Section */}
          <div className="border-t border-[#1e293b] pt-8">
            <h2 className="text-xs sm:text-sm font-bold text-stone-400 uppercase tracking-wide mb-4">
              Vista Previa de tu Perfil
            </h2>
            <div className="bg-[#131b26] border border-[#1e293b] rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-lg font-bold text-[#87ceeb]">
                  {(username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#f0f9ff]">
                    @{username || 'username'}
                  </h3>
                  <p className="text-sm text-stone-400 mt-1 max-w-md">
                    {bio || '(Sin biografía)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
