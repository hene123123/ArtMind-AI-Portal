import React from 'react';
import { useArtStore } from '../store/useArtStore';
import { Filter, RotateCcw } from 'lucide-react';

export default function GalleryPage({ childrenMinhComponent }) {
    const { filters, setFilter, resetFilters } = useArtStore();

    const categories = ['All', 'Abstract Paintings', 'Landscape Paintings', 'Flower Paintings', 'Nature Paintings', 'Figurative Paintings', 'Religious Paintings'];
    const mediums = ['All', 'Oil Painting', 'Watercolor', 'Acrylic', 'Ink'];
    const surfaces = ['All', 'Canvas', 'Paper', 'Wood Panel', 'Silk'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ===== SIDEBAR FILTER (Châu đảm nhận Layout) ===== */}
            <aside className="lg:col-span-1 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-fit space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="font-semibold text-amber-400 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Bộ Lọc Thông Minh
                    </h2>
                    <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Đặt lại
                    </button>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Danh mục Tranh</label>
                    <div className="flex flex-col gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter('category', cat)}
                                className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${
                                    filters.category === cat ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Medium Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Chất liệu Màu</label>
                    <select
                        value={filters.medium}
                        onChange={(e) => setFilter('medium', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
                    >
                        {mediums.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Surface Material Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bề mặt Vẽ</label>
                    <select
                        value={filters.surface}
                        onChange={(e) => setFilter('surface', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
                    >
                        {surfaces.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </aside>

            {/* ===== ARTWORK GRID DISPLAY AREA (Nơi nhúng Component Tranh của Minh) ===== */}
            <section className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Đang lọc theo: <strong className="text-amber-400">{filters.category}</strong></span>
                </div>

                {/* Placeholder nhúng Painting Grid của Minh */}
                {childrenMinhComponent || (
                    <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                        [Khu vực hiển thị danh sách Artwork Card do Minh phát triển]
                    </div>
                )}
            </section>
        </div>
    );
}