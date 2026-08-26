import React, { useEffect } from 'react';
import { Clock3, Heart, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useArtStore } from '../store/useArtStore';
import ArtworkCard from '../components/ArtworkCard';

function ArtworkRow({ paintings, emptyText }) {
  if (!paintings.length) return <p className="text-sm text-slate-500">{emptyText}</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {paintings.slice(0, 4).map((painting) => (
        <ArtworkCard
          key={painting.id || painting._id}
          id={painting.id || painting._id}
          title={painting.title}
          medium={painting.medium}
          author={painting.artist || painting.author}
          views={painting.views}
          imageUrl={painting.imageUrl || painting.image_url}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useArtStore((state) => state.user);
  const loading = useArtStore((state) => state.loading);
  const error = useArtStore((state) => state.error);
  const dashboardData = useArtStore((state) => state.dashboardData);
  const fetchDashboardData = useArtStore((state) => state.fetchDashboardData);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user, fetchDashboardData]);

  if (!user) {
    return (
      <section className="max-w-xl mx-auto py-20 text-center space-y-5">
        <Sparkles className="mx-auto w-12 h-12 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Dashboard cá nhân</h1>
        <p className="text-slate-400">Đăng nhập để xem yêu thích, lịch sử khám phá và gợi ý dành riêng cho bạn.</p>
        <button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-xl font-semibold">Đăng nhập</button>
      </section>
    );
  }

  if (loading && !dashboardData) {
    return <div className="py-20 text-center text-purple-300">Đang tạo dashboard cá nhân...</div>;
  }

  if (error && !dashboardData) {
    return <div className="py-20 text-center text-red-300">{error}</div>;
  }

  const data = dashboardData || { favorites: [], recent: [], recommendations: [], collections: { aiCurated: [], personalized: [] }, insights: {} };
  const insights = data.insights || {};

  return (
    <div className="space-y-8">
      <section className="border-b border-slate-800 pb-6">
        <p className="text-sm text-purple-300">Không gian của {user.firstName || user.username}</p>
        <h1 className="text-3xl font-bold text-white mt-1">Dashboard cá nhân</h1>
        <p className="text-slate-400 mt-2">Những gì bạn đã khám phá và các tác phẩm ArtMind chọn cho bạn.</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><Heart className="w-5 h-5 text-rose-400 mb-3" /><p className="text-2xl font-bold text-white">{insights.totalFavorites || data.favorites.length}</p><p className="text-xs text-slate-500">Tác phẩm yêu thích</p></div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><Clock3 className="w-5 h-5 text-cyan-400 mb-3" /><p className="text-2xl font-bold text-white">{insights.totalRecentlyViewed || data.recent.length}</p><p className="text-xs text-slate-500">Đã xem gần đây</p></div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><TrendingUp className="w-5 h-5 text-amber-400 mb-3" /><p className="text-lg font-bold text-white truncate">{insights.topStyle || 'Chưa đủ dữ liệu'}</p><p className="text-xs text-slate-500">Phong cách nổi bật</p></div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><Lightbulb className="w-5 h-5 text-emerald-400 mb-3" /><p className="text-lg font-bold text-white truncate">{insights.topCategory || 'Đang khám phá'}</p><p className="text-xs text-slate-500">Category yêu thích</p></div>
      </section>

      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Gợi ý cho bạn</h2><Link to="/gallery" className="text-xs text-purple-300 hover:text-purple-200">Xem gallery</Link></div><ArtworkRow paintings={data.recommendations} emptyText="Hãy yêu thích hoặc xem vài tác phẩm để AI cá nhân hóa gợi ý." /></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold text-white">Yêu thích</h2><ArtworkRow paintings={data.favorites} emptyText="Bạn chưa lưu tác phẩm nào." /></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold text-white">Xem gần đây</h2><ArtworkRow paintings={data.recent} emptyText="Lịch sử khám phá sẽ xuất hiện tại đây." /></section>

      {data.collections.aiCurated.length > 0 && (
        <section className="space-y-5"><h2 className="text-xl font-semibold text-white">Bộ sưu tập AI</h2>{data.collections.aiCurated.slice(0, 3).map((collection) => <div key={collection.key} className="space-y-3"><div><h3 className="font-semibold text-slate-200">{collection.title}</h3><p className="text-xs text-slate-500">{collection.paintings.length} tác phẩm nổi bật</p></div><ArtworkRow paintings={collection.paintings} emptyText="Bộ sưu tập đang được cập nhật." /></div>)}</section>
      )}
    </div>
  );
}
