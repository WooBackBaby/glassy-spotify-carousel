import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists';
import { categorizePlaylists, groupPlaylistsByCategory, CategorizedPlaylist } from '@/utils/foodCategorizer';
import CategorizedPlaylistView from '@/components/CategorizedPlaylistView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

type SortMode = 'carousel' | 'category' | 'alphabetical';

const PlaylistGallery: React.FC<PlaylistGalleryProps> = ({
  darkMode,
  toggleDarkMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | CategorizedPlaylist | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('carousel');
  
  // Extract user ID from the Spotify profile URL
  const spotifyUserId = 'kcin531'; // From the URL you provided
  
  const { data: playlists = [], isLoading, error } = useSpotifyPlaylists(spotifyUserId);

  // Categorize playlists for food-based sorting
  const categorizedPlaylists = categorizePlaylists(playlists);
  const groupedPlaylists = groupPlaylistsByCategory(categorizedPlaylists);
  
  // Alphabetically sorted playlists
  const alphabeticalPlaylists = [...playlists].sort((a, b) => a.name.localeCompare(b.name));

  const nextPlaylist = () => {
    setCurrentIndex(prev => (prev + 1) % playlists.length);
  };

  const prevPlaylist = () => {
    setCurrentIndex(prev => (prev - 1 + playlists.length) % playlists.length);
  };

  const handlePlaylistClick = (playlist: Playlist | CategorizedPlaylist) => {
    setSelectedPlaylist(selectedPlaylist?.id === playlist.id ? null : playlist);
  };

  const getVisiblePlaylists = () => {
    if (playlists.length === 0) return [];
    
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + playlists.length) % playlists.length;
      visible.push({
        playlist: playlists[index],
        offset: i
      });
    }
    return visible;
  };

  const getSortModeLabel = () => {
    switch (sortMode) {
      case 'carousel': return 'Carousel View';
      case 'category': return 'By Food Type';
      case 'alphabetical': return 'Alphabetical';
      default: return 'Carousel View';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className={`text-2xl font-light ${darkMode ? 'text-neutral-300' : 'text-slate-600'}`}>
            Loading playlists...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className={`text-2xl font-light ${darkMode ? 'text-neutral-300' : 'text-slate-600'}`}>
            Error loading playlists. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className={`text-2xl font-light ${darkMode ? 'text-neutral-300' : 'text-slate-600'}`}>
            No public playlists found for this user.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* Floating Header */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-4xl mx-auto">
          <div className={`backdrop-blur-xl border shadow-2xl px-6 py-3 rounded-full transition-colors duration-300 max-w-[800px] h-[52px] mx-auto flex items-center justify-between ${darkMode ? 'bg-neutral-900/80 border-neutral-700/20 shadow-[0_0_5px_rgba(34,197,94,0.075)] ring-1 ring-green-500/10' : 'bg-white/80 border-white/20 shadow-[0_0_5px_rgba(34,197,94,0.05)] ring-1 ring-green-400/10'}`} style={{
            boxShadow: darkMode ? '0 0 7.5px rgba(34, 197, 94, 0.1), 0 0 15px rgba(34, 197, 94, 0.025), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 0 7.5px rgba(34, 197, 94, 0.075), 0 0 15px rgba(34, 197, 94, 0.025), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`} style={{
                boxShadow: darkMode ? '0 0 2.5px rgba(34, 197, 94, 0.2)' : '0 0 2.5px rgba(34, 197, 94, 0.15)'
              }}></div>
              <div>
                <h1 className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>The Pantry</h1>
                <p className={`text-xs font-medium ${darkMode ? 'text-green-400/70' : 'text-green-500/70'}`}>
                  A collection of handpicked playlists
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Sort Mode Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={`rounded-full transition-all duration-300 backdrop-blur-sm ${darkMode ? 'bg-neutral-700/50 hover:bg-neutral-600/50 text-green-300 border border-green-500/20' : 'bg-gray-400/50 hover:bg-gray-300/50 text-green-600 border border-green-400/20'}`}>
                    {getSortModeLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'}`}>
                  <DropdownMenuItem onClick={() => setSortMode('carousel')}>
                    Carousel View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortMode('category')}>
                    By Food Type
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortMode('alphabetical')}>
                    Alphabetical
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className={`rounded-full transition-all duration-300 w-10 h-10 backdrop-blur-sm ${darkMode ? 'bg-neutral-700/50 hover:bg-neutral-600/50 text-green-300 border border-green-500/20' : 'bg-gray-400/50 hover:bg-gray-300/50 text-green-600 border border-green-400/20'}`}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-20">
        {sortMode === 'carousel' && (
          /* Carousel Section */
          <div className="max-w-4xl mx-auto px-8 mb-20">
            {/* Navigation Buttons */}
            <Button variant="ghost" size="icon" onClick={prevPlaylist} className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 progressive-blur shadow-xl hover:shadow-2xl rounded-full w-14 h-14 transition-all duration-300 hover:scale-110 ${darkMode ? 'border border-neutral-600/40' : 'border border-white/40'}`}>
              <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-neutral-200/90' : 'text-white/90'}`} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={nextPlaylist} className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 progressive-blur shadow-xl hover:shadow-2xl rounded-full w-14 h-14 transition-all duration-300 hover:scale-110 ${darkMode ? 'border border-neutral-600/40' : 'border border-white/40'}`}>
              <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-neutral-200/90' : 'text-white/90'}`} />
            </Button>

            {/* Carousel */}
            <div className="flex justify-center items-center h-[500px] overflow-hidden px-20 perspective-1000">
              {getVisiblePlaylists().map(({ playlist, offset }) => (
                <div
                  key={playlist.id}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    offset === 0 ? 'z-20' : offset === -1 || offset === 1 ? 'z-10' : 'z-0'
                  }`}
                  style={{
                    transform: `translateX(${offset * 180}px) translateY(${Math.abs(offset) * 25}px) rotateY(${offset * -20}deg) rotateZ(${offset * 4}deg) skewY(${offset * 2}deg) scale(${offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.8 : 0.65})`,
                    opacity: offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.6 : 0.3,
                    filter: offset === 0 ? 'none' : `blur(${Math.abs(offset) * 2}px)`
                  }}
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <div className="group relative preserve-3d">
                    <div className={`progressive-blur rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 ${darkMode ? 'border border-neutral-600/30' : 'border border-white/30'}`}>
                      <div className="relative overflow-hidden rounded-2xl mb-6">
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-64 h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                          <div className={`backdrop-blur-sm rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 ${darkMode ? 'bg-neutral-800/90' : 'bg-white/90'}`}>
                            <Play className={`w-8 h-8 ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`} />
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className={`font-medium text-2xl tracking-tight leading-tight transition-colors duration-300 ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`}>
                          {playlist.name}
                        </h3>
                        <p className={`text-sm font-light leading-relaxed max-w-xs mx-auto transition-colors duration-300 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                          {playlist.description}
                        </p>
                        <p className={`text-xs tracking-wide uppercase transition-colors duration-300 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
                          {playlist.trackCount} tracks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortMode === 'category' && (
          <div className="max-w-6xl mx-auto px-8 mb-20">
            <CategorizedPlaylistView
              groupedPlaylists={groupedPlaylists}
              onPlaylistClick={handlePlaylistClick}
              selectedPlaylist={selectedPlaylist}
              darkMode={darkMode}
            />
          </div>
        )}

        {sortMode === 'alphabetical' && (
          <div className="max-w-6xl mx-auto px-8 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {alphabeticalPlaylists.map(playlist => (
                <div
                  key={playlist.id}
                  className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPlaylist?.id === playlist.id ? 'ring-2 ring-green-400 rounded-2xl' : ''
                  }`}
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <div className={`backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    darkMode 
                      ? 'bg-neutral-800/60 border border-neutral-700/30' 
                      : 'bg-white/60 border border-white/30'
                  }`}>
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className={`font-medium text-lg leading-tight ${
                        darkMode ? 'text-neutral-100' : 'text-slate-900'
                      }`}>
                        {playlist.name}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-neutral-400' : 'text-slate-500'
                      }`}>
                        {playlist.trackCount} tracks
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Embedded Spotify Player */}
        {selectedPlaylist && (
          <div className="max-w-4xl mx-auto px-8 animate-fade-in">
            <div className={`backdrop-blur-md rounded-3xl shadow-2xl border overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-neutral-900/95 border-neutral-700/30' : 'bg-white/95 border-white/30'}`}>
              <div className={`p-10 border-b transition-colors duration-300 ${darkMode ? 'border-neutral-700/50' : 'border-slate-100/50'}`}>
                <div className="flex items-center space-x-6">
                  <img
                    src={selectedPlaylist.cover}
                    alt={selectedPlaylist.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                  <div>
                    <h2 className={`text-3xl font-medium tracking-tight leading-tight mb-2 transition-colors duration-300 ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`}>
                      {selectedPlaylist.name}
                    </h2>
                    <p className={`font-light text-lg transition-colors duration-300 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                      {selectedPlaylist.description} • {selectedPlaylist.trackCount} tracks
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.embedId}?utm_source=generator&theme=${darkMode ? '1' : '0'}`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t backdrop-blur-sm py-12 transition-colors duration-300 ${darkMode ? 'border-neutral-700/50 bg-neutral-900/50' : 'border-slate-100/50 bg-white/50'}`}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className={`text-sm font-light tracking-wide transition-colors duration-300 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
            Crafted with care using React, Tailwind CSS, and Spotify Web API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlaylistGallery;
