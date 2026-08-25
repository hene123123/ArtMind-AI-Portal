import React, { useRef } from 'react';
import { Download, Heart, Sparkles, User, Palette, Layers, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useArtStore } from '../store/useArtStore';

export default function PaintingDetailPage({ artwork }) {
    const detailRef = useRef();
    const { toggleFavorite, favorites } = useArtStore();

    // Mẫu dữ liệu Mockup nếu chưa truyền props
    const data = artwork || {
        id: "art-101",
        title: "Symphony of Blue Silence",
        artist: "Elena Vance",
        style: "Modern Abstract",
        medium: "Oil Painting",
        surface: "Canvas",
        dimensions: "120 x 80 cm",
        aiSummary: "Tác phẩm thể hiện sự tương phản mạnh mẽ giữa gam xanh thẫm và ánh kim vàng, tượng trưng cho sự yên bình nội tâm giữa những chuyển động phức tạp của thời đại.",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    };

    const isFav = favorites.some((f) => f.id === data.id);

    // Tính năng Châu đảm nhận: Xuất File PDF báo cáo chi tiết
    const handleExportPDF = async () => {
        const element = detailRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ArtMind_Catalogue_${data.id}.pdf`);
    };

    return (
        <div className="space-y-6">
            {/* Top Bar Actions */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{data.title}</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => toggleFavorite(data)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                            isFav ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        {isFav ? 'Đã thích' : 'Yêu thích'}
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-semibold transition"
                    >
                        <Download className="w-4 h-4" /> Tải Catalogue (PDF)
                    </button>
                </div>
            </div>

            {/* Exportable PDF Area */}
            <div ref={detailRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Painting Image */}
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                    <img src={data.imageUrl} alt={data.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>

                {/* Painting Details & AI Summary */}
                <div className="space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">{data.style}</span>
                            <h2 className="text-3xl font-extrabold text-slate-100">{data.title}</h2>
                            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-amber-400" /> Tác giả: <span className="text-slate-200">{data.artist}</span>
                            </p>
                        </div>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Palette className="w-3 h-3" /> Chất liệu màu</span>
                                <p className="text-sm font-medium text-slate-200">{data.medium}</p>
                            </div>
                            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Layers className="w-3 h-3" /> Bề mặt</span>
                                <p className="text-sm font-medium text-slate-200">{data.surface}</p>
                            </div>
                        </div>

                        {/* AI Summary Box */}
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-1.5">
                            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase">
                                <Sparkles className="w-4 h-4" /> AI Artwork Insights
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{data.aiSummary}</p>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 border-t border-slate-800 pt-3">
                        Xác thực bởi ArtMind AI Engine • Mã định danh: {data.id}
                    </div>
                </div>
            </div>
        </div>
    );
}