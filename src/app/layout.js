// tornamesa-frontend/src/app/layout.js

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Tornamesa - Letterboxd para Música',
  description: 'Registra los discos que escuchas, guarda tus favoritos y comparte con tus amigos',
  charset: 'utf-8',
};

// ✅ NUEVO: viewport export separado
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0f16',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-[#0a0f16] text-[#f0f9ff] font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
