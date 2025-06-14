
import React from 'react';
import { CategorizedPlaylist } from '@/utils/foodCategorizer';

interface PlaylistPlayerProps {
  playlist: CategorizedPlaylist;
  darkMode: boolean;
}

const PlaylistPlayer: React.FC<PlaylistPlayerProps> = ({ playlist, darkMode }) => {
  return (
    <div className="max-w-4xl mx-auto px-8 animate-fade-in">
      <div className={`backdrop-blur-md rounded-3xl shadow-2xl border overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-neutral-900/95 border-neutral-700/30' : 'bg-white/95 border-white/30'}`}>
        <div className={`p-10 border-b transition-colors duration-300 ${darkMode ? 'border-neutral-700/50' : 'border-slate-100/50'}`}>
          <div className="flex items-center space-x-6">
            <img
              src={playlist.cover}
              alt={playlist.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <h2 className={`text-3xl font-medium tracking-tight leading-tight mb-2 transition-colors duration-300 ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`}>
                {playlist.name}
              </h2>
              <p className={`font-light text-lg transition-colors duration-300 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                {playlist.description} • {playlist.trackCount} tracks
              </p>
            </div>
          </div>
        </div>
        <div className="p-0">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlist.embedId}?utm_source=generator&theme=${darkMode ? '1' : '0'}`}
            width="100%"
            height="400"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistPlayer;
