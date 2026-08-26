import React, { useState, useEffect } from 'react';
import { User, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect fill="#161b33" width="400" height="500"/>
      <text x="50%" y="48%" fill="#64748b" font-family="sans-serif" font-size="18" text-anchor="middle">ArtMind</text>
      <text x="50%" y="55%" fill="#475569" font-family="sans-serif" font-size="12" text-anchor="middle">Image unavailable</text>
    </svg>`
  );

export default function ArtworkCard({ id, title, medium, author, views, imageUrl }) {
  const [src, setSrc] = useState(imageUrl || PLACEHOLDER);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setSrc(imageUrl || PLACEHOLDER);
  }, [imageUrl]);

  return (
    <Link to={`/painting/${id}`} className="group bg-[#161b33] border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-purple-900/20 flex flex-col justify-between cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden relative bg-slate-900">
        {!failed ? (
          <img
            src={src}
            alt={title || 'Artwork'}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={() => {
              setFailed(true);
              setSrc(PLACEHOLDER);
            }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
            <ImageOff className="w-8 h-8" />
            <span className="text-[10px]">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 pointer-events-none" />
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
    </Link>
  );
}
