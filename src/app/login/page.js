"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      router.push("/");
    } else {
      setError("Credenciales incorrectas o error de conexión.");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] px-4 py-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 lowercase tracking-tighter">tornamesa</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        {error && <div className="text-[#87ceeb] text-sm text-center bg-[#87ceeb]/10 p-2 rounded">{error}</div>}

        <input
          type="email" placeholder="email" required disabled={cargando}
          className="w-full bg-[#131b26] border border-[#1e293b] p-3 rounded text-sm focus:outline-none focus:border-[#87ceeb] disabled:opacity-50 transition-colors"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="contraseña" required disabled={cargando}
          className="w-full bg-[#131b26] border border-[#1e293b] p-3 rounded text-sm focus:outline-none focus:border-[#87ceeb] disabled:opacity-50 transition-colors"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={cargando}
          className="w-full bg-[#87ceeb] text-[#0a0f16] py-3 rounded font-bold hover:bg-white transition-all disabled:opacity-50"
        >
          {cargando ? "entrando..." : "entrar"}
        </button>
      </form>
      <p className="mt-6 text-sm text-stone-500">
        ¿No tienes cuenta? <Link href="/register" className="text-[#87ceeb] hover:text-white transition-colors">Regístrate aquí</Link>
      </p>
    </div>
  );
}
