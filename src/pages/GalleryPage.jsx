import React, { useEffect } from 'react';
import { useArtStore } from '../store/useArtStore';
import { SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

export default function GalleryPage() {
    // 1. Lấy dữ liệu và các hàm thao tác từ Global Store (Zustand)
    const { 
        filters, 
        setFilter, 
        resetFilters, 
        paintings, 
        loading, 
        error, 
        fetchPaintings 
    } = useArtStore();

    // 2. Dữ liệu tĩnh cho danh sách các thể loại (Categories)
    const categories = [
        { name: 'All', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=120&q=80' },
        { name: 'Abstract', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=120&q=80' },
        { name: 'Landscape', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80' },
        { name: 'Flower', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=120&q=80' },
        { name: 'Nature', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=120&q=80' },
        { name: 'Figurative', img: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=120&q=80' },
        { name: 'Religious', img: 'https://images.unsplash.com/photo-1582561847321-4d326fdf2438?auto=format&fit=crop&w=120&q=80' },
    ];

    // 3. Tự động gọi API lấy danh sách tranh từ Backend khi trang vừa load xong
    useEffect(() => {
        fetchPaintings();
    }, []);

    return (
        <div className="bg-[#121629]/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* ===== KHU VỰC HEADER TÌM KIẾM & NÚT RESET ===== */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/60">
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                    <SlidersHorizontal className="w-6 h-6 text-purple-400" />
                    <span>Bộ Lọc Thông Minh</span>
                </h1>
                
                {/* Nút đặt lại toàn bộ bộ lọc */}
                <button
                    onClick={resetFilters}
                    className="bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 px-5 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
                </button>
            </div>

            {/* ===== KHU VỰC NỘI DUNG CHÍNH CHIA 2 CỘT ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- CỘT TRÁI: DANH SÁCH THỂ LOẠI & LƯỚI TRANH (Chiếm 8 phần) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Danh sách lọc thể loại (Dạng nút chữ nhật bo góc) */}
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Canvas category</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilter('category', cat.name)}
                                    className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                                        filters.category === cat.name || (cat.name === 'All' && filters.category === 'All')
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                                            : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hiển thị trạng thái bộ lọc hiện tại */}
                    <div className="text-xs text-slate-400">
                        Đang lọc theo: <strong className="text-slate-200">{filters.category}</strong>
                    </div>

                    {/* Xử lý hiển thị dữ liệu tranh: Đang tải, Lỗi, hoặc Thành công */}
                    {loading ? (
                        // Trạng thái đang tải dữ liệu (Loading)
                        <div className="text-center py-10 text-purple-400 animate-pulse">
                            Đang tải dữ liệu từ server...
                        </div>
                    ) : error ? (
                        // Trạng thái bị lỗi (Error)
                        <div className="text-center py-10 text-red-400">
                            {error}
                        </div>
                    ) : (
                        // Trạng thái load thành công, render danh sách Component ArtworkCard
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {paintings.map((item) => (
                                <ArtworkCard
                                    key={item._id || item.id}
                                    title={item.title}
                                    medium={item.medium}
                                    author={item.author}
                                    views={item.views}
                                    imageUrl={item.imageUrl}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- CỘT PHẢI: BỘ LỌC HÌNH ẢNH & DROP DOWN (Chiếm 4 phần) --- */}
                <div className="lg:col-span-4 bg-[#0f1324]/80 border border-slate-800/80 rounded-2xl p-5 space-y-6">
                    
                    {/* Bộ lọc thể loại dạng icon hình ảnh tròn */}
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

                    {/* Bộ lọc chất liệu và bề mặt (Dropdown Select) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Dropdown Chất liệu */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Chất liệu Màu</label>
                            <select
                                value={filters.medium}
                                onChange={(e) => setFilter('medium', e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                            >
                                <option value="All">Tất cả</option>
                                <option value="Sơn dầu">Sơn dầu</option>
                                <option value="Màu nước">Màu nước</option>
                                <option value="Acrylic">Acrylic</option>
                            </select>
                        </div>
                        
                        {/* Dropdown Bề mặt vẽ */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Bề mặt Vẽ</label>
                            <select
                                value={filters.surface}
                                onChange={(e) => setFilter('surface', e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                            >
                                <option value="All">Tất cả</option>
                                <option value="Toan">Toan</option>
                                <option value="Giấy">Giấy</option>
                                <option value="Gỗ">Gỗ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Icon trang trí góc phải bên dưới */}
            <div className="absolute bottom-4 right-6 text-purple-400/40 pointer-events-none">
                <Sparkles className="w-8 h-8" />
            </div>
        </div>
    );
}