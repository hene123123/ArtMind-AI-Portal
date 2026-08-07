import React from 'react';
import { useArtStore } from '../store/useArtStore';
import { SlidersHorizontal, RotateCcw, User, Eye, Sparkles } from 'lucide-react';

export default function GalleryPage() {
    const { filters, setFilter, resetFilters } = useArtStore();

    const categories = [
        { name: 'All', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=120&q=80' },
        { name: 'Abstract', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=120&q=80' },
        { name: 'Landscape', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80' },
        { name: 'Flower', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=120&q=80' },
        { name: 'Nature', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=120&q=80' },
        { name: 'Figurative', img: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=120&q=80' },
        { name: 'Religious', img: 'https://images.unsplash.com/photo-1582561847321-4d326fdf2438?auto=format&fit=crop&w=120&q=80' },
    ];

    const sampleArtworks = [
        {
            id: '1',
            title: 'Abstract card atetructure',
            style: 'Oil Twatmpark...',
            medium: 'Sơn dầu',
            author: 'User 1',
            imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '2',
            title: 'Landscape',
            style: 'Landscape Painting',
            medium: 'Sơn dầu',
            author: 'User 2',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '3',
            title: 'Bioahetd Nature',
            style: 'Nature Concept',
            medium: 'Sơn dầu',
            author: 'User 3',
            imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '4',
            title: 'Oli galaxy',
            style: 'Galaxy Abstract',
            medium: 'Sơn dầu',
            author: 'User 4',
            imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '5',
            title: 'Roto portrais',
            style: 'Girl with Pearl Earring',
            medium: 'Sơn dầu',
            views: 40,
            imageUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=600&q=80'
        }
    ];

    return (
        <div className="bg-[#121629]/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">

            {/* ===== HEADER SECTION ===== */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/60">
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                    <SlidersHorizontal className="w-6 h-6 text-purple-400" />
                    <span>Bộ Lọc Thông Minh</span>
                </h1>
                <button
                    onClick={resetFilters}
                    className="bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 px-5 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
                </button>
            </div>

            {/* ===== TWO-COLUMN MAIN CONTENT ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Canvas Category & Gallery Grid */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Canvas Category Selector (Pill Style) */}
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Canvas category</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {['All', 'Abstract', 'Landscape', 'Flower', 'Flower', 'Nature', 'Figurative', 'Religious'].map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilter('category', cat)}
                                    className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                                        filters.category === cat || (cat === 'All' && filters.category === 'All')
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                                            : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-slate-400">
                        Đang lọc theo: <strong className="text-slate-200">{filters.category}</strong>
                    </div>

                    {/* Placeholder Message */}
                    <div className="text-xs text-slate-500 italic bg-slate-900/40 border border-dashed border-slate-800 p-3 rounded-xl">
                        [Khu vực hiển thị danh sách Artwork Card do Minh phát triển]
                    </div>

                    {/* Painting Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {sampleArtworks.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-[#161b33] border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-purple-900/20 flex flex-col justify-between"
                            >
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                                </div>
                                <div className="p-2.5 space-y-1">
                                    <h3 className="text-xs font-bold text-slate-200 truncate">{item.title}</h3>
                                    <p className="text-[10px] text-slate-400">{item.medium}</p>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> {item.author || item.views}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Visual Category Thumbnails & Controls */}
                <div className="lg:col-span-4 bg-[#0f1324]/80 border border-slate-800/80 rounded-2xl p-5 space-y-6">

                    {/* Visual Category Thumbnails (Bộ hợt tự) */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bộ hợt tự</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilter('category', cat.name)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className={`w-10 h-10 rounded-xl overflow-hidden border transition ${
                                        filters.category === cat.name ? 'border-purple-400 ring-2 ring-purple-500/40' : 'border-slate-700/80 group-hover:border-slate-500'
                                    }`}>
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[10px] text-slate-400 truncate w-full text-center">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Select Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Chất liệu Màu</label>
                            <select
                                value={filters.medium}
                                onChange={(e) => setFilter('medium', e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                            >
                                <option value="Sơn dầu">Sơn dầu</option>
                                <option value="Màu nước">Màu nước</option>
                                <option value="Acrylic">Acrylic</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Bề mặt Vẽ</label>
                            <select
                                value={filters.surface}
                                onChange={(e) => setFilter('surface', e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                            >
                                <option value="Toan">Toan</option>
                                <option value="Giấy">Giấy</option>
                                <option value="Gỗ">Gỗ</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-400">
                        <span>Sơn dầu</span>
                        <div className="mt-2">Đang lọc theo: <strong className="text-slate-200">{filters.category}</strong></div>
                    </div>
                </div>

            </div>

            {/* Decorative Four-Pointed Star Icon */}
            <div className="absolute bottom-4 right-6 text-purple-400/40 pointer-events-none">
                <Sparkles className="w-8 h-8" />
            </div>
        </div>
    );
}