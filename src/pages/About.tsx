
import React from 'react';
import FloatingHeader from '@/components/FloatingHeader';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

const AboutContent = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <FloatingHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-20">
        <div className={`backdrop-blur-md rounded-2xl p-8 shadow-lg ${darkMode ? 'bg-neutral-800/60 border border-neutral-700/30' : 'bg-white/60 border border-white/30'}`}>
          <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-neutral-100' : 'text-slate-900'}`}>
            About The Pantry
          </h1>
          
          <div className={`text-lg leading-relaxed space-y-6 ${darkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
            <p>
              Welcome to The Pantry, a curated collection of Spotify playlists that blend music with the art of cooking and dining.
            </p>
            
            <p>
              My friend has an incredible talent for creating playlists that capture the essence of different foods, cuisines, and culinary experiences. What started as a fun personal project has grown into something truly special - each playlist is thoughtfully crafted to complement specific flavors, moods, and dining moments.
            </p>
            
            <p>
              From the energetic beats that pair perfectly with spicy dishes to the mellow tunes that enhance a cozy brunch, these playlists transform how we experience food through music. I thought these amazing creations were too good to keep to ourselves, so I built this gallery to share them with the world.
            </p>
            
            <p>
              Whether you're cooking, dining, or just looking for your next favorite song, I hope you find something here that adds a little more flavor to your day.
            </p>
            
            <p className={`text-base italic ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              Bon appétit and happy listening! 🎵🍽️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <ThemeProvider>
      <AboutContent />
    </ThemeProvider>
  );
};

export default About;
