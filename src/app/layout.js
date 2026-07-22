// tornamesa-frontend/src/app/layout.js

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Tornamesa - Letterboxd para Música',
  description: 'Registra los discos que escuchas, guarda tus favoritos y comparte con tus amigos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  charset: 'utf-8',
  icons: {
    icon: '🎵'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Prevent zoom on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Theme color */}
        <meta name="theme-color" content="#0a0f16" />
        {/* Preconnect to Supabase */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body className="bg-[#0a0f16] text-[#f0f9ff] font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
