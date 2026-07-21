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
  const [mensaje, setMensaje] = useState({ text: "", type: "" });

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

  if (!user) return <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center text-stone-500 text-sm">Cargando ajustes...</div>;
  if (cargandoDatos) return <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center text-stone-500 text-sm">Cargando tus datos...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ text: "", type: "" });
    try {
      await api.updateUserProfile(user.id, { username, bio });
      router.push(`/${username}`);
    } catch (error) {
      setMensaje({ text: "No se pudieron guardar los cambios. Intenta de nuevo.", type: "error" });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] px-4 md:px-6 py-6 md:py-12 font-sans">
      <div className="max-w-5xl mx-auto mt-2 md:mt-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 md:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#87ceeb] shrink-0">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ajustes de Perfil</h1>
            <p className="text-xs text-stone-500 mt-1">Modifica tu identidad pública en Tornamesa.</p>
          </div>
        </div>

        {mensaje.text && (
          <div className={`mb-6 p-3 rounded text-sm ${mensaje.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
            {mensaje.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fade-in grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-10 lg:gap-12">
          {/* Lado Izquierdo: Formulario */}
          <div className="space-y-6">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#16202c] border border-[#233044] p-3 rounded text-sm text-stone-100 focus:outline-none focus:border-[#87ceeb] transition-colors"
                placeholder="Escribe tu username..."
                required
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Email address</label>
              <input
                type="email"
                className="w-full bg-[#111822] border border-[#1e293b] p-3 rounded text-sm text-stone-500 cursor-not-allowed focus:outline-none opacity-70"
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
                className="w-full bg-[#16202c] border border-[#233044] p-3 rounded text-sm text-stone-100 focus:outline-none focus:border-[#87ceeb] resize-none transition-colors"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/${username || "usuario"}`)}
                className="w-full sm:w-auto bg-transparent border border-[#1e293b] text-stone-400 px-6 py-3 rounded text-sm font-bold hover:text-white hover:bg-[#1e293b]/50 transition-all text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="w-full sm:w-auto bg-[#87ceeb] text-[#0a0f16] px-6 py-3 rounded text-sm font-bold hover:bg-[#a1dcfa] transition-all disabled:opacity-50 text-center"
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>

          {/* Lado Derecho: Slots de Favoritos */}
          <div className="order-first lg:order-last">
            <h2 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-4 border-b border-[#1e293b] pb-2">Álbumes Favoritos</h2>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#131b26] border border-dashed border-[#233044] flex items-center justify-center text-stone-600 rounded cursor-pointer hover:border-[#87ceeb] hover:text-[#87ceeb] hover:bg-[#1e293b]/20 transition-all text-xl"
                >
                  +
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 mt-3 font-sans">Haz clic para buscar y anclar tus favoritos.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
