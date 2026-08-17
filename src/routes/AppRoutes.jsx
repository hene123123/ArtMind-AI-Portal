import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GalleryPage from '../pages/GalleryPage';
import PaintingDetailPage from '../pages/PaintingDetailPage';
import UserDashboard from '../pages/UserDashboard';

// Mock component cho module AI Scan Ảnh
const ImageRecognitionPage = () => (
  <div className="p-8 text-center text-slate-400 bg-[#121629]/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl">
    [Module AI Scan Ảnh - Do Minh xây dựng UI]
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/gallery" replace />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="painting/:id" element={<PaintingDetailPage />} />
          <Route path="ai-recognition" element={<ImageRecognitionPage />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="*" element={<Navigate to="/gallery" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
