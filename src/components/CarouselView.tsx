
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategorizedPlaylist } from '@/utils/foodCategorizer';
import { useIsMobile } from '@/hooks/use-mobile';

interface CarouselViewProps {
  playlists: CategorizedPlaylist[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onPlaylistClick: (playlist: CategorizedPlaylist) => void;
  darkMode: boolean;
}

const CarouselView: React.FC<CarouselViewProps> = ({
  playlists,
  currentIndex,
  onNext,
  onPrev,
  onPlaylistClick,
  darkMode
}) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  console.log('isMobile:', isMobile, 'window width:', typeof window !== 'undefined' ? window.innerWidth : 'N/A');

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = Math.abs(touchStartX.current - touchEndX.current);
    if (diff > 10) {
      setIsDragging(true);
      // Prevent default to avoid scrolling
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        onNext();
      } else {
        // Swiped right - go to previous
        onPrev();
      }
    }
    setIsDragging(false);
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

  return (
    <div className="max-w-4xl mx-auto px-8 mb-8 relative">
      {/* Navigation Buttons - Only show on desktop */}
      {!isMobile && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrev} 
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-30 shadow-xl hover:shadow-2xl rounded-full w-14 h-14 transition-all duration-300 hover:scale-110 ${darkMode ? 'progressive-blur border border-neutral-600/40' : 'bg-white/90 hover:bg-white border border-slate-200/50'}`}
          >
            <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-neutral-200/90' : 'text-slate-700/90'}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext} 
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-30 shadow-xl hover:shadow-2xl rounded-full w-14 h-14 transition-all duration-300 hover:scale-110 ${darkMode ? 'progressive-blur border border-neutral-600/40' : 'bg-white/90 hover:bg-white border border-slate-200/50'}`}
          >
            <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-neutral-200/90' : 'text-slate-700/90'}`} />
          </Button>
        </>
      )}

      {/* Carousel */}
      <div 
        className={`flex justify-center items-center h-[500px] overflow-hidden perspective-1000 ${isMobile ? 'px-4 touch-pan-y' : 'px-20'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: isMobile ? 'pan-y' : 'auto' }}
      >
        {getVisiblePlaylists().map(({ playlist, offset }) => (
          <div
            key={playlist.id}
            className={`absolute transition-all duration-700 ease-out cursor-pointer ${
              offset === 0 ? 'z-20' : offset === -1 || offset === 1 ? 'z-10' : 'z-0'
            }`}
            style={{
              transform: `translateX(${offset * (isMobile ? 120 : 180)}px) translateY(${Math.abs(offset) * 25}px) rotateY(${offset * -20}deg) rotateZ(${offset * 4}deg) skewY(${offset * 2}deg) scale(${offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.8 : 0.65})`,
              opacity: offset === 0 ? 1 : offset === -1 || offset === 1 ? 0.6 : 0.3,
              filter: offset === 0 ? 'none' : `blur(${Math.abs(offset) * 2}px)`
            }}
            onClick={() => !isDragging && onPlaylistClick(playlist)}
          >
            <div className="group relative preserve-3d">
              <div className={`progressive-blur rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 ${darkMode ? 'border border-neutral-600/30' : 'border border-white/30'}`}>
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}
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
  );
};

export default CarouselView;
