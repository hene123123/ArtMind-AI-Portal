import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GalleryPage from '../pages/GalleryPage';
import PaintingDetailPage from '../pages/PaintingDetailPage';

// Mock component cho các trang khác
const ImageRecognitionPage = () => <div className="p-8 text-center text-slate-400">[Module AI Scan Ảnh - Do Minh xây dựng UI]</div>;
const DashboardPage = () => <div className="p-8 text-center text-slate-400">[User Dashboard & Analytics - Do Châu & Minh kết hợp]</div>;

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/gallery" replace />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="painting/:id" element={<PaintingDetailPage />} />
                    <Route path="ai-recognition" element={<ImageRecognitionPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="*" element={<Navigate to="/gallery" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}