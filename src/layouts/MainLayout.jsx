import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Image, LayoutDashboard, Sparkles, BrainCircuit } from 'lucide-react';
import { useArtStore } from '../store/useArtStore';

export default function MainLayout({ children }) {
    const { searchQuery, setSearchQuery } = useArtStore();
    const location = useLocation();
    const nav = useNavigate(); 

    return (
        <div className="min-h-screen bg-[#0b0d19] text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
            
            {/* Dải Banner thông báo mỏng gọn ở trên cùng */}
            <div className="relative z-20 bg-gradient-to-r from-purple-900/30 via-[#121629] to-purple-900/30 border-b border-purple-500/20 py-2 text-center shadow-lg">
                <p className="text-[11px] text-slate-300 font-medium">
                    Bạn chưa có tài khoản? {' '}
                    <span 
                        onClick={() => nav('/auth')} 
                        className="text-purple-400 font-bold cursor-pointer hover:text-purple-300 underline underline-offset-2 transition-colors"
                    >
                        Đăng ký ngay
                    </span>
                    {' '}để xem nhiều tranh đẹp hơn nhé! ✨
                </p>
            </div>

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px]" />
                <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[140px]" />
            </div>

            <header className="relative z-10 max-w-[1400px] mx-auto px-6 pt-4 pb-2 flex items-center justify-between gap-6">

                <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <span className="bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent font-extrabold">
                        ArtMind AI
                    </span>
                </Link>

                <div className="flex-1 max-w-xl relative">
                    <span className="absolute -top-5 left-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Search</span>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder='Tìm kiếm NLP: "Show oil paintings of a galaxy"...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#161a2e]/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                </div>

                <nav className="flex items-center gap-3">
                    <Link
                        to="/gallery"
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all border ${
                            location.pathname.includes('/gallery') || location.pathname === '/'
                                ? 'bg-gradient-to-b from-purple-600/30 to-indigo-600/20 border-purple-500/60 text-white shadow-lg shadow-purple-500/20'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Sparkles className="w-5 h-5 mb-1 text-purple-400" />
                        <span className="text-[11px] font-medium">Gallery</span>
                    </Link>

                    <Link
                        to="/ai-recognition"
                        className={`flex flex-col items-center justify-center w-20 h-16 rounded-2xl transition-all border ${
                            location.pathname.includes('/ai-recognition')
                                ? 'bg-gradient-to-b from-purple-600/30 to-indigo-600/20 border-purple-500/60 text-white shadow-lg shadow-purple-500/20'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Image className="w-5 h-5 mb-1" />
                        <span className="text-[11px] font-medium">AI Style Scan</span>
                    </Link>

                    <Link
                        to="/dashboard"
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all border ${
                            location.pathname.includes('/dashboard')
                                ? 'bg-gradient-to-b from-purple-600/30 to-indigo-600/20 border-purple-500/60 text-white shadow-lg shadow-purple-500/20'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5 mb-1" />
                        <span className="text-[11px] font-medium">Dashboard</span>
                    </Link>

                    <div 
                        className="ml-2 pl-2 border-l border-slate-800 cursor-pointer"
                        onClick={() => nav('/auth')}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                            alt="User"
                            className="w-10 h-10 rounded-full border border-purple-500/40 object-cover shadow-md hover:ring-2 hover:ring-purple-400 transition-all"
                        />
                    </div>
                </nav>
            </header>

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-4">
                <Outlet />
                {children}
            </main>

            <footer className="relative z-10 text-center text-xs text-slate-500 py-8 space-y-1">
                <p>© 2026 ArtMind AI Portal. Phát triển bởi <strong className="text-indigo-400">Châu & Minh</strong> (Frontend Specialists).</p>
                <p className="text-slate-600">Tích hợp Machine Learning, NLP Search, Visual AI & Recommendation Systems.</p>
            </footer>
        </div>
    );
}