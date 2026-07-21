"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push("/");
    else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] p-6 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-8 lowercase">tornamesa</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email" placeholder="email" required
          className="w-full bg-[#131b26] border border-[#1e293b] p-3 rounded text-sm focus:outline-none focus:border-[#87ceeb]"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="contraseña" required
          className="w-full bg-[#131b26] border border-[#1e293b] p-3 rounded text-sm focus:outline-none focus:border-[#87ceeb]"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-[#87ceeb] text-[#0a0f16] py-3 rounded font-bold hover:bg-white transition-all">
          entrar
        </button>
      </form>
    </div>
  );
}
