import { create } from 'zustand';

export const useArtStore = create((set) => ({
    // User Data
    user: { name: "Châu & Minh", role: "Art Collector", avatar: "https://i.pravatar.cc/150?img=33" },
    favorites: [],
    recentlyViewed: [],

    // Search & Filters State
    searchQuery: '',
    filters: {
        category: 'All', // Abstract, Landscape, Nature, etc.
        medium: 'All',   // Oil, Watercolor, Acrylic
        surface: 'All',  // Canvas, Paper, Wood
    },

    // Actions
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
        return { recentlyViewed: [artwork, ...filtered].slice(0, 10) }; // Lưu tối đa 10 tác phẩm gần nhất
    })
}));