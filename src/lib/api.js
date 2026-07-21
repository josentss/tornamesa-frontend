const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Buscar álbumes en Spotify a través del backend
  searchAlbums: async (query) => {
    console.log("🔍 Intentando conectar a:", `${API_BASE_URL}/api/search?q=${query}`);

    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      const textoError = await response.text();
      throw new Error(`Código ${response.status}: ${textoError || response.statusText}`);
    }
    return response.json();
  },

  // Registrar una nueva escucha de álbum
  registerListen: async (albumId, userId, rating, review) => {
    const response = await fetch(`${API_BASE_URL}/api/listen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId, userId, rating, review }),
    });
    if (!response.ok) throw new Error('Error al registrar la escucha');
    return response.json();
  },

  // Obtener historial y estadísticas del usuario
  getUserHistory: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/history`);
    if (!response.ok) throw new Error('Error al obtener el historial');
    return response.json();
  },

  // Generar el resumen mensual (Wrapped)
  generateMonthlySummary: async (userId, year, month) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/summaries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month }),
    });
    if (!response.ok) throw new Error('Error al generar el resumen');
    return response.json();
  },

  // Obtener datos guardados del perfil
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    if (!response.ok) throw new Error('Error al obtener los datos del perfil');
    return response.json();
  },

  // Obtener perfil público usando el username de la URL
    getProfileByUsername: async (username) => {
      const response = await fetch(`${API_BASE_URL}/api/profiles/username/${username}`);
      if (!response.ok) throw new Error('Perfil no encontrado');
      return response.json();
    },

  // Actualizar datos del perfil
  updateUserProfile: async (userId, datos) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error(`Código ${response.status}`);
    return response.json();
  }
};
