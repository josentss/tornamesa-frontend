"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Efecto para cargar los datos reales del perfil guardados en la BD
  useEffect(() => {
    if (!user?.id) return;

    const cargarDatosPerfil = async () => {
      try {
        const datos = await api.getUserProfile(user.id);
        if (datos) {
          setUsername(datos.username || "");
          setBio(datos.bio || "");
        }
      } catch (error) {
        console.error("Error cargando perfil del usuario:", error);
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatosPerfil();
  }, [user?.id]);

  if (!user) return <div className="min-h-screen bg-[#0a0f16] p-12 text-[#f0f9ff]">Cargando ajustes...</div>;
  if (cargandoDatos) return <div className="min-h-screen bg-[#0a0f16] p-12 text-[#f0f9ff]">Cargando tus datos actuales...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.updateUserProfile(user.id, { username, bio });
      router.push(`/${username}`);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      alert("No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] p-6 font-sans">
      <div className="max-w-5xl mx-auto mt-8">

        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center text-3xl font-bold text-[#87ceeb]">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in grid grid-cols-1 md:grid-cols-[1fr,420px] gap-12">

          {/* Lado Izquierdo: Campos del Formulario */}
          <div className="space-y-5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#16202c] border border-[#233044] p-2.5 rounded text-sm text-stone-100 focus:outline-none focus:border-[#87ceeb]"
                placeholder="Escribe tu username..."
                required
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Email address</label>
              <input
                type="email"
                className="w-full bg-[#111822] border border-[#1e293b] p-2.5 rounded text-sm text-stone-500 cursor-not-allowed focus:outline-none"
                defaultValue={user.email}
                disabled
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-[#16202c] border border-[#233044] p-2.5 rounded text-sm text-stone-100 focus:outline-none focus:border-[#87ceeb] resize-none"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={guardando}
                className="bg-[#87ceeb] text-[#0a0f16] px-5 py-2 rounded text-sm font-bold hover:bg-[#a1dcfa] transition-all disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${username || "usuario"}`)}
                className="bg-transparent border border-[#1e293b] text-stone-400 px-5 py-2 rounded text-sm font-bold hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Lado Derecho: Slots de Favoritos */}
          <div>
            <h2 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-4 border-b border-[#1e293b] pb-2">FAVORITE ALBUMS</h2>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#131b26] border border-dashed border-[#233044] flex items-center justify-center text-stone-600 rounded cursor-pointer hover:border-[#87ceeb] hover:text-[#87ceeb] transition-all text-xl"
                >
                  +
                </div>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 mt-3 font-sans">Drag posters to reorder.</p>
          </div>

        </form>

      </div>
    </div>
  );
}
