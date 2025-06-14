
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategorizedPlaylist } from '@/utils/foodCategorizer';

interface CategorizedPlaylistViewProps {
  groupedPlaylists: { [key: string]: CategorizedPlaylist[] };
  onPlaylistClick: (playlist: CategorizedPlaylist) => void;
  selectedPlaylist: CategorizedPlaylist | null;
  darkMode: boolean;
}

const CategorizedPlaylistView: React.FC<CategorizedPlaylistViewProps> = ({
  groupedPlaylists,
  onPlaylistClick,
  selectedPlaylist,
  darkMode
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const categories = Object.keys(groupedPlaylists).sort();

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const playlists = groupedPlaylists[category];
        const isCollapsed = collapsedCategories.has(category);
        const categoryEmoji = playlists[0]?.categoryEmoji || '🍽️';

        return (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div 
              className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/30' 
                  : 'bg-white/50 hover:bg-white/70 border border-white/30'
              }`}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center space-x-3">
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
                <h2 className={`text-2xl font-medium ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`}>
                  {categoryEmoji} {category}
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {playlists.length}
                </Badge>
              </div>
            </div>

            {/* Category Playlists */}
            {!isCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-8">
                {playlists.map(playlist => (
                  <div
                    key={playlist.id}
                    className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPlaylist?.id === playlist.id ? 'ring-2 ring-green-400 rounded-2xl' : ''
                    }`}
                    onClick={() => onPlaylistClick(playlist)}
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
                          <Badge variant="secondary" className="text-xs">
                            {playlist.categoryEmoji}
                          </Badge>
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
                          {playlist.trackCount} tracks
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategorizedPlaylistView;
