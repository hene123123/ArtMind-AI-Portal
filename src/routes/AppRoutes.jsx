import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GalleryPage from '../pages/GalleryPage';
import PaintingDetailPage from '../pages/PaintingDetailPage';
import AiScanPage from '../pages/AiScanPage';
import AuthPage from '../pages/AuthPage'; // (thêm import trang AuthPage ở đây)

// Mock component cho các trang khác
const ImageRecognitionPage = () => <div className="p-8 text-center text-slate-400"><AiScanPage /></div>;
const DashboardPage = () => <div className="p-8 text-center text-slate-400">[User Dashboard & Analytics - Do Châu & Minh kết hợp]</div>;

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* (thêm Route cho trang auth ở ngoài MainLayout để giao diện full màn hình, không bị dính thanh menu) */}
                <Route path="/auth" element={<AuthPage />} />

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