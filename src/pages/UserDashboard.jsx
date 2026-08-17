import React, { useState } from 'react';
import { 
  User, Heart, Sparkles, FolderHeart, Clock, 
  Settings, Shield, LogOut, Eye, Plus, Upload, Palette 
} from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('favorites');

  // Dữ liệu mẫu thống kê
  const stats = [
    { label: 'Yêu thích', value: '24', icon: Heart, color: 'text-rose-400' },
    { label: 'Bộ sưu tập', value: '3', icon: FolderHeart, color: 'text-purple-400' },
    { label: 'AI Scans', value: '18', icon: Sparkles, color: 'text-amber-400' },
    { label: 'Lượt xem', value: '1.2k', icon: Eye, color: 'text-indigo-400' },
  ];

  // Dữ liệu mẫu tranh đã lưu
  const favoriteArtworks = [
    {
      id: '1',
      title: 'Abstract card atetructure',
      style: 'Oil Painting',
      author: 'Châu & Minh',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      title: 'Landscape Galaxy',
      style: 'Digital Art',
      author: 'AI Generated',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3',
      title: 'Oli galaxy',
      style: 'Impressionism',
      author: 'Minh Specialist',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
    },
  ];

  // Dữ liệu lịch sử AI Scan
  const aiHistory = [
    { id: 1, action: 'Quét phong cách "Tranh Sơn Dầu Ấn Tượng"', date: '10 phút trước', score: '98% Match' },
    { id: 2, action: 'Tìm kiếm NLP: "Show oil paintings of a galaxy"', date: '2 giờ trước', score: '12 Kết quả' },
    { id: 3, action: 'Phân tích bảng màu Thổ Hoàng & Xanh Chàm', date: 'Hôm qua', score: 'Hoàn tất' },
  ];

  return (
    <div className="space-y-6">
      {/* ===== PROFILE HEADER ===== */}
      <div className="bg-[#121629]/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Info User */}
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="User Avatar"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/60 shadow-xl shadow-purple-950/50"
              />
              <span className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1.5 rounded-xl text-xs shadow-md">
                <Palette className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold text-slate-100">Nguyễn Văn Châu</h1>
                <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  PRO ARTIST
                </span>
              </div>
              <p className="text-xs text-slate-400">Chuyên gia Nghệ thuật số & Frontend Specialist</p>
              <p className="text-[11px] text-slate-500">Thành viên từ tháng 01/2026 • artmind.portal@ai.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Tải Tranh Mới
            </button>
            <button className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 p-2.5 rounded-xl transition">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* ===== STATS COUNTER GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="bg-[#161b33]/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-100 mt-0.5">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 ${stat.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN CONTENT TABS & PANEL ===== */}
      <div className="bg-[#121629]/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" /> Tranh Đã Lưu
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" /> Lịch Sử AI Scan
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-400" /> Cài Đặt
          </button>
        </div>

        {/* TAB 1: FAVORITE ARTWORKS GRID */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteArtworks.map((item) => (
              <div
                key={item.id}
                className="group bg-[#161b33] border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md flex flex-col justify-between"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-slate-950/60 backdrop-blur-md rounded-xl text-rose-400 border border-slate-700/60 hover:bg-rose-600 hover:text-white transition">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="text-sm font-bold text-slate-200 truncate">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{item.style}</span>
                    <span className="text-slate-500">{item.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: AI HISTORY LIST */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {aiHistory.map((item) => (
              <div key={item.id} className="bg-[#161b33]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.action}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-purple-300 bg-purple-900/30 border border-purple-700/50 px-3 py-1 rounded-full">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SETTINGS FORM */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tên hiển thị</label>
              <input
                type="text"
                defaultValue="Nguyễn Văn Châu"
                className="w-full bg-[#181d38] border border-slate-700/80 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email liên hệ</label>
              <input
                type="email"
                defaultValue="artmind.portal@ai.com"
                className="w-full bg-[#181d38] border border-slate-700/80 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30">
              Cập nhật hồ sơ
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
