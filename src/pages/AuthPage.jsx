import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const nav = useNavigate();
    const [isLog, setIsLog] = useState(true);
    
    // Thêm lại state cho Tên đăng nhập (un = username)
    const [un, setUn] = useState('');
    const [fn, setFn] = useState('');
    const [ln, setLn] = useState('');
    const [pn, setPn] = useState('');
    const [gd, setGd] = useState('Nam');
    const [em, setEm] = useState('');
    const [pw, setPw] = useState('');

    const hdlSub = (e) => {
        e.preventDefault();
        if (isLog) {
            console.log("Login:", { em, pw }); // 'em' lúc này có thể là email hoặc username
        } else {
            console.log("Register:", { un, fn, ln, pn, gd, em, pw });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0d1c] p-4 relative overflow-hidden select-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-full max-w-md bg-[#121629]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
                
                <button 
                    type="button"
                    onClick={() => nav(-1)} 
                    className="absolute top-5 right-5 text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="text-purple-400" /> 
                        ArtMind AI
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {isLog ? 'Đăng nhập để khám phá thư viện' : 'Tạo tài khoản mới để bắt đầu'}
                    </p>
                </div>

                <form onSubmit={hdlSub} className="space-y-4">
                    {/* Các trường chỉ hiện khi Đăng ký */}
                    {!isLog && (
                        <>
                            {/* ⚡️ Đã thêm lại ô Tên đăng nhập */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Tên đăng nhập</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={un}
                                        onChange={(e) => setUn(e.target.value)}
                                        className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="Tên viết liền không dấu (VD: minh123)"
                                        required={!isLog}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Họ</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={ln}
                                            onChange={(e) => setLn(e.target.value)}
                                            className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Họ"
                                            required={!isLog}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Tên</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={fn}
                                            onChange={(e) => setFn(e.target.value)}
                                            className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Tên"
                                            required={!isLog}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            type="tel" 
                                            value={pn}
                                            onChange={(e) => setPn(e.target.value)}
                                            className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="09xx..."
                                            required={!isLog}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Giới tính</label>
                                    <select 
                                        value={gd}
                                        onChange={(e) => setGd(e.target.value)}
                                        className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Dùng chung cho cả Đăng nhập & Đăng ký */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            {isLog ? 'Email hoặc Tên đăng nhập' : 'Email'}
                        </label>
                        <div className="relative">
                            {/* Dùng icon User nếu đang ở form Đăng nhập (vì có thể nhập username), dùng Mail nếu form Đăng ký */}
                            {isLog ? (
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            ) : (
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            )}
                            <input 
                                type="text" 
                                value={em}
                                onChange={(e) => setEm(e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder={isLog ? "Email hoặc Tên đăng nhập" : "name@example.com"}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="password" 
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                className="w-full bg-[#181d38] border border-slate-700 text-sm text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl py-3 mt-4 transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                        {isLog ? 'Đăng Nhập' : 'Đăng Ký'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    {isLog ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button 
                        type="button"
                        onClick={() => setIsLog(!isLog)}
                        className="text-purple-400 font-semibold hover:text-purple-300 transition-colors outline-none"
                    >
                        {isLog ? 'Đăng ký ngay' : 'Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
}