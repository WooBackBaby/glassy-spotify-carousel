
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortMode = 'carousel' | 'category' | 'alphabetical';

interface FloatingHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  darkMode,
  toggleDarkMode,
  sortMode,
  setSortMode
}) => {
  const getSortModeLabel = () => {
    switch (sortMode) {
      case 'carousel': return 'Carousel View';
      case 'category': return 'By Food Type';
      case 'alphabetical': return 'Alphabetical';
      default: return 'Carousel View';
    }
  };

  return (
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
  );
};

export default FloatingHeader;
