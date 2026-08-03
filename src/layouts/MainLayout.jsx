import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Heart, User, Compass, Image, LayoutDashboard, Bot } from 'lucide-react';
import { useArtStore } from '../store/useArtStore';

export default function MainLayout({ children }) {
    const { searchQuery, setSearchQuery, favorites } = useArtStore();
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/gallery?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
            {/* ===== HEADER / NAVBAR ===== */}
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <span>ArtMind AI</span>
                    </Link>

                    {/* Smart NLP Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
                        <input
                            type="text"
                            placeholder='Thử tìm NLP: "Show oil paintings with nature themes"...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/90 text-sm text-slate-200 rounded-full pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-amber-400 transition"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </form>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/gallery" className="hover:text-amber-400 flex items-center gap-1.5 transition">
                            <Compass className="w-4 h-4" /> Gallery
                        </Link>
                        <Link to="/ai-recognition" className="hover:text-amber-400 flex items-center gap-1.5 transition">
                            <Image className="w-4 h-4" /> AI Style Scan
                        </Link>
                        <Link to="/dashboard" className="hover:text-amber-400 flex items-center gap-1.5 transition">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>

                        {/* Favorites Icon Counter */}
                        <Link to="/dashboard" className="relative p-2 text-slate-300 hover:text-amber-400 transition">
                            <Heart className="w-5 h-5" />
                            {favorites.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-xs rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ===== MAIN CONTENT CONTAINER ===== */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
                {children}
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
                    <p>© 2026 ArtMind AI Portal. Phát triển bởi **Châu & Minh** (Frontend Specialists).</p>
                    <p className="text-slate-500">Tích hợp Machine Learning, NLP Search, Visual AI & Recommendation Systems.</p>
                </div>
            </footer>
        </div>
    );
}