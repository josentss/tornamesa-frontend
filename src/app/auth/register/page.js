"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, LoadingSpinner } from "../../../components/shared";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos requeridos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("Mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      alert("Registrado. Verifica tu email.");
      router.push("/auth/login");
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Registrando..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">tornamesa</h1>
          <p className="text-stone-400">Crea una cuenta</p>
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirma contraseña"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#87ceeb] text-[#0a0f16] py-2 font-bold hover:bg-white disabled:opacity-50 rounded transition-all"
          >
            registrarse
          </button>
        </form>

        <div className="text-center text-sm text-stone-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-[#87ceeb] hover:text-white">
            entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
