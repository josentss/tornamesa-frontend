"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, LoadingSpinner } from "../../../components/shared";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email y contraseña requeridos");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">tornamesa</h1>
          <p className="text-stone-400">Inicia sesión</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="contraseña"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#87ceeb] text-[#0a0f16] py-2 font-bold hover:bg-white disabled:opacity-50 rounded transition-all"
          >
            entrar
          </button>
        </form>

        <div className="text-center text-sm text-stone-400">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-[#87ceeb] hover:text-white">
            registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
