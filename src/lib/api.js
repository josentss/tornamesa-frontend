// tornamesa-frontend/src/lib/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tornamesa-back.onrender.com';

// 🔧 FUNCIONES AUXILIARES
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Error ${response.status}`);
  }
  return response.json();
};

const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// ==================== API METHODS ====================

export const api = {
  // 🔍 BÚSQUEDA
  searchAlbums: (query) =>
    fetchApi(`/api/search?q=${encodeURIComponent(query)}`),

  // 🎵 ESCUCHAS
  registerListen: (albumId, userId, rating, review) =>
    fetchApi('/api/listen', {
      method: 'POST',
      body: JSON.stringify({ albumId, userId, rating, review })
    }),

  getUserHistory: (userId, limit = 50, offset = 0) =>
    fetchApi(`/api/users/${userId}/history?limit=${limit}&offset=${offset}`),

  // 👤 PERFIL
  getUserProfile: (userId) =>
    fetchApi(`/api/users/${userId}`),

  updateUserProfile: (userId, { username, bio }) =>
    fetchApi(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ username, bio })
    }),

  getPublicProfile: (username) =>
    fetchApi(`/api/profiles/username/${username}`),

  getPublicHistory: (username, limit = 20) =>
    fetchApi(`/api/profiles/${username}/history?limit=${limit}`),

  // 📊 RESÚMENES
  generateMonthlySummary: (userId, year, month) =>
    fetchApi(`/api/users/${userId}/summaries/generate`, {
      method: 'POST',
      body: JSON.stringify({ year, month })
    }),

  // ❤️ HEALTH
  checkHealth: () =>
    fetchApi('/health').catch(() => ({ status: 'offline' }))
};

export default api;
