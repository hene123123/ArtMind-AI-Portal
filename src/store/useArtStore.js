import { create } from 'zustand';

// URL Backend của ông C
const API_BASE_URL = 'http://localhost:5000/api';

export const useArtStore = create((set, get) => ({
    // ==========================================
    // 1. DATA TỪ BACKEND (Mới bổ sung)
    // ==========================================
    paintings: [],
    loading: false,
    error: null,
    aiAnalysisResult: null, // Lưu kết quả phân tích ảnh từ Gemini Vision

    // ==========================================
    // 2. USER DATA & LOCAL STATE
    // ==========================================
    user: { name: "Châu & Minh", role: "Art Collector", avatar: "https://i.pravatar.cc/150?img=33" },
    favorites: [],
    recentlyViewed: [],

    // Search & Filters State
    searchQuery: '',
    filters: {
        category: 'All', 
        medium: 'All',   
        surface: 'All',  
    },

    // ==========================================
    // 3. API ACTIONS (Kết nối Backend Express)
    // ==========================================

    // 🔹 API 1: Lấy toàn bộ danh sách tranh
    fetchPaintings: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/paintings`);
            const result = await res.json();
            if (result.success) {
                set({ paintings: result.data, loading: false });
            }
        } catch (err) {
            console.error("Lỗi fetch paintings:", err);
            set({ error: "Không thể kết nối tới Server Backend", loading: false });
        }
    },

    // 🔹 API 2: Smart Search bằng AI (Gemini NLP)
    executeSmartSearch: async (queryText) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/search/smart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryText })
            });
            const result = await res.json();
            if (result.success) {
                set({ paintings: result.data, loading: false });
            }
        } catch (err) {
            console.error("Lỗi Smart Search:", err);
            set({ error: "Lỗi xử lý AI Search", loading: false });
        }
    },

    // 🔹 API 3: Nhận diện ảnh tải lên bằng AI (Gemini Vision + ColorThief)
    uploadAndRecognizeImage: async (imageFile) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const res = await fetch(`${API_BASE_URL}/recognize`, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                set({ 
                    aiAnalysisResult: result.analysis, 
                    paintings: result.similar_paintings, // Cập nhật danh sách tranh gợi ý tương tự
                    loading: false 
                });
            }
        } catch (err) {
            console.error("Lỗi Image Recognition:", err);
            set({ error: "Lỗi nhận diện ảnh AI", loading: false });
        }
    },

    // ==========================================
    // 4. LOCAL ACTIONS
    // ==========================================
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),
    resetFilters: () => set({
        searchQuery: '',
        filters: { category: 'All', medium: 'All', surface: 'All' }
    }),

    toggleFavorite: (artwork) => set((state) => {
        const exists = state.favorites.some((item) => item.id === artwork.id);
        if (exists) {
            return { favorites: state.favorites.filter((item) => item.id !== artwork.id) };
        }
        return { favorites: [...state.favorites, artwork] };
    }),

    addRecentlyViewed: (artwork) => set((state) => {
        const filtered = state.recentlyViewed.filter((item) => item.id !== artwork.id);
        return { recentlyViewed: [artwork, ...filtered].slice(0, 10) };
    })
}));