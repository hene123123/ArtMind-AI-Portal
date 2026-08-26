import { create } from 'zustand';

// URL Backend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper: chuẩn hoá field ảnh + id từ backend (snake_case → camelCase)
function normalizePainting(p) {
  if (!p) return p;
  return {
    ...p,
    id: p.id || p._id,
    imageUrl: p.imageUrl || p.image_url || '',
    artist: p.artist || p.author || '',
    author: p.author || p.artist || '',
    aiSummary: p.aiSummary || p.ai_summary || '',
    aiTags: p.aiTags || p.ai_tags || [],
    colorTheme: p.colorTheme || p.color_theme || '',
    primaryColor: p.primaryColor || p.primary_color || '',
  };
}

function getAuthHeaders() {
  const token = localStorage.getItem('artmind_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export const useArtStore = create((set, get) => ({
  // ==========================================
  // 1. DATA TỪ BACKEND
  // ==========================================
  paintings: [],
  loading: false,
  error: null,
  aiAnalysisResult: null,
  dashboardData: null,

  // ==========================================
  // 2. USER DATA & LOCAL STATE
  // ==========================================
  user: null, // null = chưa login
  token: localStorage.getItem('artmind_token') || null,
  favorites: JSON.parse(localStorage.getItem('artmind_favorites') || '[]'),
  recentlyViewed: JSON.parse(localStorage.getItem('artmind_recent') || '[]'),

  searchQuery: '',
  filters: {
    category: 'All',
    medium: 'All',
    surface: 'All',
  },

  // ==========================================
  // 3. AUTH ACTIONS
  // ==========================================
  login: async (loginId, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginId, username: loginId, password }),
      });
      const result = await res.json();
      if (!result.success) {
        set({ error: result.message || 'Đăng nhập thất bại', loading: false });
        return { success: false, message: result.message };
      }
      localStorage.setItem('artmind_token', result.token);
      localStorage.setItem('artmind_user', JSON.stringify(result.user));
      set({ user: result.user, token: result.token, loading: false, error: null });
      return { success: true, user: result.user };
    } catch (err) {
      console.error('Login error:', err);
      set({ error: 'Không thể kết nối tới Server Backend', loading: false });
      return { success: false, message: 'Không thể kết nối tới Server' };
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) {
        set({ error: result.message || 'Đăng ký thất bại', loading: false });
        return { success: false, message: result.message };
      }
      localStorage.setItem('artmind_token', result.token);
      localStorage.setItem('artmind_user', JSON.stringify(result.user));
      set({ user: result.user, token: result.token, loading: false, error: null });
      return { success: true, user: result.user };
    } catch (err) {
      console.error('Register error:', err);
      set({ error: 'Không thể kết nối tới Server Backend', loading: false });
      return { success: false, message: 'Không thể kết nối tới Server' };
    }
  },

  logout: () => {
    localStorage.removeItem('artmind_token');
    localStorage.removeItem('artmind_user');
    set({ user: null, token: null });
  },

  // Khôi phục session khi reload trang
  restoreSession: () => {
    const token = localStorage.getItem('artmind_token');
    const userStr = localStorage.getItem('artmind_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token });
      } catch {
        localStorage.removeItem('artmind_token');
        localStorage.removeItem('artmind_user');
      }
    }
  },

  // ==========================================
  // 4. API ACTIONS
  // ==========================================
  fetchPaintings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/paintings?limit=50`);
      const result = await res.json();
      if (result.success) {
        const normalized = (result.data || []).map(normalizePainting);
        set({ paintings: normalized, loading: false });
      } else {
        set({ error: result.message || 'Lỗi lấy danh sách tranh', loading: false });
      }
    } catch (err) {
      console.error('Lỗi fetch paintings:', err);
      set({ error: 'Không thể kết nối tới Server Backend', loading: false });
    }
  },

  fetchPaintingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/paintings/${encodeURIComponent(id)}`);
      const result = await res.json();
      if (!result.success) {
        set({ error: result.message || 'Không tìm thấy tranh', loading: false });
        return null;
      }
      const painting = normalizePainting(result.data);
      set({ loading: false, error: null });
      return painting;
    } catch (err) {
      console.error('Lỗi fetch painting:', err);
      set({ error: 'Không thể kết nối tới Server Backend', loading: false });
      return null;
    }
  },

  executeSmartSearch: async (queryText) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/search/smart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ query: queryText }),
      });
      const result = await res.json();
      if (result.success) {
        const normalized = (result.data || []).map(normalizePainting);
        set({ paintings: normalized, loading: false });
      } else {
        set({ error: result.message || 'Lỗi Smart Search', loading: false });
      }
    } catch (err) {
      console.error('Lỗi Smart Search:', err);
      set({ error: 'Lỗi xử lý AI Search', loading: false });
    }
  },

  uploadAndRecognizeImage: async (imageFile) => {
    set({ loading: true, error: null, aiAnalysisResult: null });
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const token = localStorage.getItem('artmind_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/recognize`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        set({
          aiAnalysisResult: result.analysis,
          paintings: (result.similar_paintings || []).map(normalizePainting),
          loading: false,
        });
      } else {
        set({ error: result.message || 'Lỗi nhận diện ảnh', loading: false });
      }
    } catch (err) {
      console.error('Lỗi Image Recognition:', err);
      set({ error: 'Lỗi nhận diện ảnh AI', loading: false });
    }
  },

  fetchDashboardData: async () => {
    const token = localStorage.getItem('artmind_token');
    if (!token) return null;
    set({ loading: true, error: null });
    try {
      const headers = getAuthHeaders();
      const [favoritesRes, recentRes, recommendationsRes, collectionsRes, insightsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/me/favorites`, { headers }),
        fetch(`${API_BASE_URL}/users/me/recent`, { headers }),
        fetch(`${API_BASE_URL}/users/me/recommendations?limit=8`, { headers }),
        fetch(`${API_BASE_URL}/users/me/collections?limit=4`, { headers }),
        fetch(`${API_BASE_URL}/analytics/insights`, { headers }),
      ]);
      const payloads = await Promise.all([
        favoritesRes.json(), recentRes.json(), recommendationsRes.json(), collectionsRes.json(), insightsRes.json(),
      ]);
      if (payloads.some((payload) => !payload.success)) {
        throw new Error('Không thể tải dashboard');
      }
      const [favorites, recent, recommendations, collections, insights] = payloads;
      const data = {
        favorites: favorites.data.map(normalizePainting),
        recent: recent.data.map(normalizePainting),
        recommendations: (recommendations.recommendations || []).map(normalizePainting),
        collections: {
          aiCurated: (collections.data?.aiCurated || []).map((collection) => ({
            ...collection,
            paintings: collection.paintings.map(normalizePainting),
          })),
          personalized: (collections.data?.personalized || []).map(normalizePainting),
        },
        insights: insights.data,
      };
      set({ dashboardData: data, favorites: data.favorites, recentlyViewed: data.recent, loading: false });
      localStorage.setItem('artmind_favorites', JSON.stringify(data.favorites));
      localStorage.setItem('artmind_recent', JSON.stringify(data.recent));
      return data;
    } catch (err) {
      console.error('Dashboard error:', err);
      set({ error: 'Không thể tải dữ liệu cá nhân', loading: false });
      return null;
    }
  },

  // ==========================================
  // 5. LOCAL ACTIONS
  // ==========================================
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () =>
    set({
      searchQuery: '',
      filters: { category: 'All', medium: 'All', surface: 'All' },
    }),

  toggleFavorite: async (artwork) => {
    const state = get();
    const id = artwork.id || artwork._id;
    const exists = state.favorites.some((item) => (item.id || item._id) === id);
    if (state.token) {
      const response = await fetch(`${API_BASE_URL}/users/me/favorites/${encodeURIComponent(id)}`, {
        method: exists ? 'DELETE' : 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) return;
    }
    set((currentState) => {
      let next;
      if (exists) {
        next = currentState.favorites.filter((item) => (item.id || item._id) !== id);
      } else {
        next = [...currentState.favorites, normalizePainting(artwork)];
      }
      localStorage.setItem('artmind_favorites', JSON.stringify(next));
      return { favorites: next };
    });
  },

  addRecentlyViewed: async (artwork) => {
    const id = artwork.id || artwork._id;
    const token = localStorage.getItem('artmind_token');
    if (token) {
      fetch(`${API_BASE_URL}/users/me/recent/${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      }).catch((err) => console.error('Lỗi đồng bộ lịch sử xem:', err));
    }
    set((state) => {
      const filtered = state.recentlyViewed.filter((item) => (item.id || item._id) !== id);
      const next = [normalizePainting(artwork), ...filtered].slice(0, 10);
      localStorage.setItem('artmind_recent', JSON.stringify(next));
      return { recentlyViewed: next };
    });
  },
}));
