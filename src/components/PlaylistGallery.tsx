
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Playlist {
  id: string;
  name: string;
  cover: string;
  spotifyUrl: string;
  embedId: string;
  description: string;
  trackCount: number;
}

interface PlaylistGalleryProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const PlaylistGallery: React.FC<PlaylistGalleryProps> = ({ darkMode, toggleDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const playlists: Playlist[] = [
    {
      id: '1',
      name: 'Chill Vibes',
      cover: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
      embedId: '37i9dQZF1DX0XUsuxWHRQd',
      description: 'Relaxing beats for focus and calm',
      trackCount: 42
    },
    {
      id: '2',
      name: 'Lo-Fi Beats',
      cover: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
      embedId: '37i9dQZF1DWWQRwui0ExPn',
      description: 'Study and work soundscapes',
      trackCount: 38
    },
    {
      id: '3',
      name: 'Indie Focus',
      cover: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2Nc3B70tvx0',
      embedId: '37i9dQZF1DX2Nc3B70tvx0',
      description: 'Independent artists you need to hear',
      trackCount: 31
    },
    {
      id: '4',
      name: 'Acoustic Bliss',
      cover: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa',
      embedId: '37i9dQZF1DX1s9knjP51Oa',
      description: 'Stripped down, raw emotion',
      trackCount: 28
    },
    {
      id: '5',
      name: 'Midnight Jazz',
      cover: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT',
      embedId: '37i9dQZF1DX0SM0LYsmbMT',
      description: 'Smooth jazz for late nights',
      trackCount: 35
    }
  ];

  const nextPlaylist = () => {
    setCurrentIndex((prev) => (prev + 1) % playlists.length);
  };

  const prevPlaylist = () => {
    setCurrentIndex((prev) => (prev - 1 + playlists.length) % playlists.length);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(selectedPlaylist?.id === playlist.id ? null : playlist);
  };

  const getVisiblePlaylists = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + playlists.length) % playlists.length;
      visible.push({ playlist: playlists[index], offset: i });
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-5xl font-light tracking-tight text-slate-900 leading-tight">
                Curated
              </h1>
              <p className="text-slate-500 text-lg font-light tracking-wide">
                A collection of handpicked playlists
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-slate-50 transition-all duration-300 w-12 h-12"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-20">
        {/* Carousel Section */}
        <div className="max-w-7xl mx-auto px-8 mb-20">
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPlaylist}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-lg hover:shadow-xl rounded-full w-14 h-14 border border-slate-200/60 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPlaylist}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-lg hover:shadow-xl rounded-full w-14 h-14 border border-slate-200/60 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Carousel */}
            <div className="flex justify-center items-center h-[500px] overflow-hidden px-20 perspective-1000">
              {getVisiblePlaylists().map(({ playlist, offset }) => (
                <div
                  key={playlist.id}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    offset === 0
                      ? 'z-20'
                      : offset === -1 || offset === 1
                      ? 'z-10'
                      : 'z-0'
                  }`}
                  style={{
                    transform: `translateX(${offset * 200}px) translateY(${Math.abs(offset) * 20}px) rotateY(${offset * -15}deg) rotateZ(${offset * 3}deg) scale(${
                      offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.85 : 0.7
                    })`,
                    opacity: offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.7 : 0.4,
                    filter: offset === 0 ? 'none' : `blur(${Math.abs(offset) * 1.5}px)`,
                  }}
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <div className="group relative preserve-3d">
                    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:scale-105 border border-slate-100">
                      <div className="relative overflow-hidden rounded-2xl mb-6">
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-64 h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                            <Play className="w-8 h-8 text-slate-900" />
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="font-medium text-2xl text-slate-900 tracking-tight leading-tight">
                          {playlist.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                          {playlist.description}
                        </p>
                        <p className="text-slate-400 text-xs tracking-wide uppercase">
                          {playlist.trackCount} tracks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded Spotify Player */}
        {selectedPlaylist && (
          <div className="max-w-5xl mx-auto px-8 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-100">
                <div className="flex items-center space-x-6">
                  <img
                    src={selectedPlaylist.cover}
                    alt={selectedPlaylist.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                  <div>
                    <h2 className="text-3xl font-medium text-slate-900 tracking-tight leading-tight mb-2">
                      {selectedPlaylist.name}
                    </h2>
                    <p className="text-slate-500 font-light text-lg">
                      {selectedPlaylist.description} • {selectedPlaylist.trackCount} tracks
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.embedId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-slate-400 text-sm font-light tracking-wide">
            Crafted with care using React, Tailwind CSS, and Spotify Web API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlaylistGallery;
