import React from 'react';
import { User } from 'lucide-react';

export default function ArtworkCard({ title, medium, author, views, imageUrl }) {
    return (
        <div className="group bg-[#161b33] border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-purple-900/20 flex flex-col justify-between cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-2.5 space-y-1">
                <h3 className="text-xs font-bold text-slate-200 truncate">{title}</h3>
                <p className="text-[10px] text-slate-400">{medium}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> {author || views}
                    </span>
                </div>
            </div>
        </div>
    );
}