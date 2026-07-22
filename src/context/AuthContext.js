// tornamesa-frontend/src/context/AuthContext.js

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Restaurar sesión al montar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 👂 Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setError(null);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 📝 SIGN UP
  const signUp = async (email, password) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password
      });

      if (signUpError) throw signUpError;

      return { success: true, user: data.user };
    } catch (err) {
      const message = err.message || 'Error en registro';
      setError(message);
      throw err;
    }
  };

  // 🔑 SIGN IN
  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (signInError) throw signInError;

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.message || 'Error en inicio de sesión';
      setError(message);
      throw err;
    }
  };

  // 🚪 SIGN OUT
  const signOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Error al cerrar sesión';
      setError(message);
      throw err;
    }
  };

  // 🔄 RESET PASSWORD
  const resetPassword = async (email) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (resetError) throw resetError;

      return { success: true };
    } catch (err) {
      const message = err.message || 'Error al resetear contraseña';
      setError(message);
      throw err;
    }
  };

  // 🔐 UPDATE PASSWORD
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      return { success: true };
    } catch (err) {
      const message = err.message || 'Error al actualizar contraseña';
      setError(message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
