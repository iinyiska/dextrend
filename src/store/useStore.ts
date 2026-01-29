import { create } from 'zustand';
import { Pair, Chain, SUPPORTED_CHAINS } from '@/lib/types';

interface AppState {
    // Theme
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Pair[];
    setSearchResults: (results: Pair[]) => void;
    isSearching: boolean;
    setIsSearching: (loading: boolean) => void;

    // Chain filter
    selectedChain: string | null;
    setSelectedChain: (chainId: string | null) => void;
    chains: Chain[];

    // Sidebar
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Watchlist (stored in localStorage)
    watchlist: string[];
    addToWatchlist: (pairId: string) => void;
    removeFromWatchlist: (pairId: string) => void;
    isInWatchlist: (pairId: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
    // Theme
    theme: 'dark',
    setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
            localStorage.setItem('dextrend-theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    },
    toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
    },

    // Search
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),
    isSearching: false,
    setIsSearching: (loading) => set({ isSearching: loading }),

    // Chain filter
    selectedChain: null,
    setSelectedChain: (chainId) => set({ selectedChain: chainId }),
    chains: SUPPORTED_CHAINS,

    // Sidebar
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    // Watchlist
    watchlist: [],
    addToWatchlist: (pairId) => {
        const watchlist = [...get().watchlist, pairId];
        set({ watchlist });
        if (typeof window !== 'undefined') {
            localStorage.setItem('dextrend-watchlist', JSON.stringify(watchlist));
        }
    },
    removeFromWatchlist: (pairId) => {
        const watchlist = get().watchlist.filter((id) => id !== pairId);
        set({ watchlist });
        if (typeof window !== 'undefined') {
            localStorage.setItem('dextrend-watchlist', JSON.stringify(watchlist));
        }
    },
    isInWatchlist: (pairId) => get().watchlist.includes(pairId),
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('dextrend-theme') as 'dark' | 'light' | null;
    const savedWatchlist = localStorage.getItem('dextrend-watchlist');

    if (savedTheme) {
        useStore.getState().setTheme(savedTheme);
    } else {
        // Default to dark theme
        useStore.getState().setTheme('dark');
    }

    if (savedWatchlist) {
        try {
            useStore.setState({ watchlist: JSON.parse(savedWatchlist) });
        } catch { }
    }
}
