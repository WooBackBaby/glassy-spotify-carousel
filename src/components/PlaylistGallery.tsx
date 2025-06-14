
import React, { useState } from 'react';
import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists';
import { categorizePlaylists, groupPlaylistsByCategory, CategorizedPlaylist, FOOD_CATEGORIES } from '@/utils/foodCategorizer';
import CategorizedPlaylistView from '@/components/CategorizedPlaylistView';
import FloatingHeader from '@/components/FloatingHeader';
import CarouselView from '@/components/CarouselView';
import CategoryFilterChips from '@/components/CategoryFilterChips';
import PlaylistPlayer from '@/components/PlaylistPlayer';

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
  const [selectedPlaylist, setSelectedPlaylist] = useState<CategorizedPlaylist | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('carousel');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const spotifyUserId = 'kcin531';
  const { data: playlists = [], isLoading, error } = useSpotifyPlaylists(spotifyUserId);

  const categorizedPlaylists = categorizePlaylists(playlists);
  const groupedPlaylists = groupPlaylistsByCategory(categorizedPlaylists);
  
  const filteredPlaylists = selectedCategory && selectedCategory !== 'All'
    ? categorizedPlaylists.filter(playlist => playlist.category === selectedCategory)
    : categorizedPlaylists;
  
  const alphabeticalCategorizedPlaylists = [...filteredPlaylists].sort((a, b) => a.name.localeCompare(b.name));

  const categoriesWithCounts = [
    { name: 'All', count: categorizedPlaylists.length, emoji: '🍽️' },
    ...FOOD_CATEGORIES.map(category => ({
      name: category.name,
      count: categorizedPlaylists.filter(p => p.category === category.name).length,
      emoji: category.emoji
    })).filter(category => category.count > 0),
    {
      name: 'Other',
      count: categorizedPlaylists.filter(p => p.category === 'Other').length,
      emoji: '🍽️'
    }
  ].filter(category => category.count > 0);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const nextPlaylist = () => {
    setCurrentIndex(prev => (prev + 1) % filteredPlaylists.length);
  };

  const prevPlaylist = () => {
    setCurrentIndex(prev => (prev - 1 + filteredPlaylists.length) % filteredPlaylists.length);
  };

  const handlePlaylistClick = (playlist: CategorizedPlaylist) => {
    setSelectedPlaylist(selectedPlaylist?.id === playlist.id ? null : playlist);
  };

  React.useEffect(() => {
    if (playlists.length > 0) {
      console.log('=== COMPLETE FRONTEND PLAYLIST ANALYSIS ===');
      console.log('Total playlists received:', playlists.length);
      console.log('All playlist names:');
      playlists.forEach((playlist, index) => {
        console.log(`${index + 1}. "${playlist.name}"`);
      });
      console.log('=== END COMPLETE FRONTEND ANALYSIS ===');
    }
  }, [playlists]);

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
      <FloatingHeader
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />

      <main className="flex-1 pt-32 pb-20">
        {sortMode === 'carousel' && (
          <>
            <CarouselView
              playlists={filteredPlaylists}
              currentIndex={currentIndex}
              onNext={nextPlaylist}
              onPrev={prevPlaylist}
              onPlaylistClick={handlePlaylistClick}
              darkMode={darkMode}
            />

            <CategoryFilterChips
              categories={categoriesWithCounts}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              darkMode={darkMode}
            />
          </>
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
              {alphabeticalCategorizedPlaylists.map(playlist => (
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
                      <div className="absolute top-2 right-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-neutral-700/80 text-neutral-200' : 'bg-white/80 text-slate-700'
                        }`}>
                          {playlist.categoryEmoji}
                        </div>
                      </div>
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
                        {playlist.trackCount} tracks • {playlist.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPlaylist && (
          <PlaylistPlayer playlist={selectedPlaylist} darkMode={darkMode} />
        )}
      </main>

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
