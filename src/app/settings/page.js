"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Header, Footer, LoadingSpinner, ErrorMessage, SuccessMessage } from "../../components/shared";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) {
      router.push("/auth/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await api.getUserProfile(user.id);
        if (data) {
          setUsername(data.username || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username requerido");
      return;
    }

    setSaving(true);
    try {
      await api.updateUserProfile(user.id, { username, bio });
      setSuccess("Guardado");
      setTimeout(() => {
        router.push(`/perfil/${username}`);
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f16]">
      <Header user={user} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 md:px-6 py-6 md:py-12">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="text-xs text-stone-500 font-bold mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="tu username"
              disabled={saving}
            />
            <p className="text-xs text-stone-500 mt-1">Perfil público: /perfil/{username || "username"}</p>
          </div>

          <div>
            <label className="text-xs text-stone-500 font-bold mb-2 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti"
              rows={4}
              disabled={saving}
              className="resize-none"
            />
            <p className="text-xs text-stone-500 mt-1">{bio.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#87ceeb] text-[#0a0f16] px-4 py-2 font-bold hover:bg-white disabled:opacity-50 rounded transition-all"
            >
              {saving ? "guardando..." : "guardar"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[#1e293b] text-stone-400 px-4 py-2 hover:border-[#87ceeb] hover:text-[#87ceeb] rounded transition-all"
            >
              cancelar
            </button>
          </div>
        </form>

        <div className="border-t border-[#1e293b] pt-6">
          <p className="text-xs text-stone-500 mb-4">{user.email}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
