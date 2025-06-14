
import React from 'react';
import PlaylistGallery from '@/components/PlaylistGallery';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

const IndexContent = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <PlaylistGallery darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
