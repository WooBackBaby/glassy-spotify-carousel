
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100">
                Curated
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-light">
                A collection of handpicked playlists
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16">
        {/* Carousel Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPlaylist}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl rounded-full w-12 h-12 border border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPlaylist}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl rounded-full w-12 h-12 border border-slate-200 dark:border-slate-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Carousel */}
            <div className="flex justify-center items-center h-96 overflow-hidden px-16">
              {getVisiblePlaylists().map(({ playlist, offset }) => (
                <div
                  key={playlist.id}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    offset === 0
                      ? 'z-20 scale-100'
                      : offset === -1 || offset === 1
                      ? 'z-10 scale-90 opacity-60'
                      : 'z-0 scale-75 opacity-30'
                  }`}
                  style={{
                    transform: `translateX(${offset * 240}px) scale(${
                      offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.9 : 0.75
                    })`,
                    opacity: offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.6 : 0.3,
                  }}
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <div className="group relative">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-slate-200/50 dark:border-slate-700/50">
                      <div className="relative overflow-hidden rounded-2xl mb-4">
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-56 h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-medium text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                          {playlist.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-light">
                          {playlist.description}
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-xs">
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
          <div className="max-w-5xl mx-auto px-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="p-8 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedPlaylist.cover}
                    alt={selectedPlaylist.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                      {selectedPlaylist.name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-light">
                      {selectedPlaylist.description} • {selectedPlaylist.trackCount} tracks
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.embedId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="380"
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
      <footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-light">
            Crafted with care using React, Tailwind CSS, and Spotify Web API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlaylistGallery;
