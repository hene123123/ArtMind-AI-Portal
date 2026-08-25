import React, { useState } from 'react';
import { Upload, Scan, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useArtStore } from '../store/useArtStore';

export default function AiScanPage() {
    const [img, setImg] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const analysis = useArtStore((state) => state.aiAnalysisResult);
    const error = useArtStore((state) => state.error);
    const uploadAndRecognizeImage = useArtStore((state) => state.uploadAndRecognizeImage);

    const handleScan = async () => {
        if (!imageFile) return;
        setIsScanning(true);
        await uploadAndRecognizeImage(imageFile);
        setIsScanning(false);
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden pt-8">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-fuchsia-900/10 blur-[100px]"></div>
            </div>

            <main className="flex-1 relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-12 flex flex-col gap-12">
                <section className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
                        <Sparkles className="w-10 h-10 text-purple-400" />
                        AI Image Scan
                    </h1>
                    <p className="text-lg text-slate-400">Tải ảnh lên để nhận diện nội dung, phong cách và màu sắc bằng AI.</p>
                </section>

                <section className="w-full max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-200">
                        <div className="space-y-6">
                            <div className={`relative bg-[#131022] border-2 border-dashed rounded-2xl p-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] overflow-hidden group ${img ? 'border-purple-500/50' : 'border-slate-700 hover:border-purple-500 cursor-pointer'}`}>
                                {!isScanning && (
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setImageFile(file);
                                                setImg(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                )}

                                {img ? (
                                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                                        <img src={img} alt="Upload" className="max-h-[330px] object-contain z-0" />
                                        {isScanning && (
                                            <>
                                                <div className="absolute inset-0 bg-purple-900/20 z-0"></div>
                                                <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-400 shadow-[0_0_15px_#d946ef] animate-[scan_2s_ease-in-out_infinite] z-10"></div>
                                                <style>{`
                                                    @keyframes scan {
                                                        0%, 100% { top: 0%; }
                                                        50% { top: 100%; }
                                                    }
                                                `}</style>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto text-purple-400 group-hover:scale-110 group-hover:bg-purple-900/30 transition-all">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Kéo thả ảnh vào đây</h3>
                                            <p className="text-sm text-slate-500 mt-1">hoặc click để tải lên từ thiết bị (JPG, PNG)</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleScan}
                                disabled={!img || isScanning}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                                    !img 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                        : isScanning
                                            ? 'bg-purple-600/50 text-white cursor-wait'
                                            : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                }`}
                            >
                                {isScanning ? (
                                    <>
                                        <Scan className="w-5 h-5 animate-pulse" /> Đang phân tích bằng NLP...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" /> Quét ảnh ngay
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="h-full">
                            {analysis ? (
                                <div className="bg-[#131022] border border-purple-500/30 rounded-2xl p-6 h-full space-y-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] animate-[fade-in_0.5s_ease-out]">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" /> Báo cáo phân tích
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="bg-[#1a1630] p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-sm text-slate-400 mb-1">Phong cách / đặc điểm</p>
                                            <p className="text-lg font-semibold text-fuchsia-400">{analysis.style}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1a1630] p-4 rounded-xl border border-slate-700/50">
                                                <p className="text-sm text-slate-400 mb-1">Độ chính xác</p>
                                                <p className="text-lg font-semibold text-emerald-400">{Math.round((analysis.confidence || 0) * 100)}%</p>
                                            </div>
                                            <div className="bg-[#1a1630] p-4 rounded-xl border border-slate-700/50">
                                                <p className="text-sm text-slate-400 mb-1">Nội dung chính</p>
                                                <p className="text-sm font-semibold text-white">{analysis.subject || analysis.category}</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#1a1630] p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-sm text-slate-400 mb-2">Bảng màu nhận diện</p>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full shadow-lg border border-slate-600" style={{ backgroundColor: analysis.dominant_color?.hex }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-[#1a1630] p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-sm text-slate-400 mb-1">Đánh giá chuyên sâu</p>
                                            <p className="text-sm text-slate-300 leading-relaxed">{analysis.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="bg-[#131022]/50 border border-red-500/30 rounded-2xl h-full min-h-[350px] flex items-center justify-center text-red-300 p-6 text-center">
                                    <p>{error}</p>
                                </div>
                            ) : (
                                <div className="bg-[#131022]/50 border border-slate-800 border-dashed rounded-2xl h-full min-h-[350px] flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                                    <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Kết quả phân tích từ AI sẽ hiển thị tại đây sau khi quét.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}