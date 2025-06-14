
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Playlist {
  id: string;
  name: string;
  cover: string;
  spotifyUrl: string;
  embedId: string;
}

interface PlaylistGalleryProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const PlaylistGallery: React.FC<PlaylistGalleryProps> = ({ darkMode, toggleDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Sample playlists - in a real app, these would come from Spotify API
  const playlists: Playlist[] = [
    {
      id: '1',
      name: 'Chill Vibes',
      cover: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
      embedId: '37i9dQZF1DX0XUsuxWHRQd'
    },
    {
      id: '2',
      name: 'Lo-Fi Beats',
      cover: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
      embedId: '37i9dQZF1DWWQRwui0ExPn'
    },
    {
      id: '3',
      name: 'Indie Focus',
      cover: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2Nc3B70tvx0',
      embedId: '37i9dQZF1DX2Nc3B70tvx0'
    },
    {
      id: '4',
      name: 'Acoustic Bliss',
      cover: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa',
      embedId: '37i9dQZF1DX1s9knjP51Oa'
    },
    {
      id: '5',
      name: 'Midnight Jazz',
      cover: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT',
      embedId: '37i9dQZF1DX0SM0LYsmbMT'
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="modern-header sticky top-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Playlist Gallery</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Discover your perfect soundtrack</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="modern-card hover:modern-card-elevated rounded-full w-12 h-12"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Carousel Container */}
        <div className="relative w-full max-w-6xl">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPlaylist}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 modern-card hover:modern-card-elevated rounded-full w-12 h-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextPlaylist}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 modern-card hover:modern-card-elevated rounded-full w-12 h-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Carousel */}
          <div className="flex justify-center items-center h-80 overflow-hidden">
            {getVisiblePlaylists().map(({ playlist, offset }) => (
              <div
                key={playlist.id}
                className={`absolute transition-all duration-500 ease-out cursor-pointer ${
                  offset === 0
                    ? 'z-20 scale-110'
                    : offset === -1 || offset === 1
                    ? 'z-10 scale-90 opacity-70'
                    : 'z-0 scale-75 opacity-40'
                }`}
                style={{
                  transform: `translateX(${offset * 200}px) scale(${
                    offset === 0 ? 1.1 : offset === -1 || offset === 1 ? 0.9 : 0.75
                  })`,
                  opacity: offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.7 : 0.4,
                }}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="relative group">
                  <div className="modern-card hover:modern-card-elevated p-4 transition-all duration-300 hover:scale-105 hover:-translate-y-4">
                    <img
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-48 h-48 object-cover rounded-xl"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold text-lg gradient-text">{playlist.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Spotify Player */}
        {selectedPlaylist && (
          <div className="mt-12 w-full max-w-4xl animate-fade-in">
            <div className="modern-card-elevated p-6">
              <h2 className="text-2xl font-bold gradient-text mb-4 text-center">
                Now Playing: {selectedPlaylist.name}
              </h2>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.embedId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="modern-header border-t border-slate-200 dark:border-slate-700 p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Built with 💖 using React, Tailwind CSS, and Spotify Web API
        </p>
      </footer>
    </div>
  );
};

export default PlaylistGallery;
