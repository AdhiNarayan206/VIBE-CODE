import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute, FaMoon, FaSun, FaSpotify, FaSpa, FaBell } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const BottomUtilitiesBar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [soundOn, setSoundOn] = useState(false);
  const [bellOn, setBellOn] = useState(true);
  const [showMeditationModal, setShowMeditationModal] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  // Check if Spotify is connected from localStorage
  React.useEffect(() => {
    const isSpotifyConnected = localStorage.getItem('dozy-spotify-connected') === 'true';
    setSpotifyConnected(isSpotifyConnected);
    
    // Get sound settings
    const ambientSound = localStorage.getItem('dozy-ambient-sound');
    setSoundOn(ambientSound && ambientSound !== 'none');
    
    // Get bell settings
    const bellSetting = localStorage.getItem('dozy-bell-enabled');
    if (bellSetting !== null) {
      setBellOn(bellSetting === 'true');
    }
  }, []);
  
  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    
    // In a real app, this would actually play/pause the ambient sound
    if (newState) {
      const savedSound = localStorage.getItem('dozy-ambient-sound') || 'rain';
      localStorage.setItem('dozy-ambient-sound', savedSound);
    } else {
      localStorage.setItem('dozy-ambient-sound', 'none');
    }
  };
  
  const toggleBell = () => {
    const newState = !bellOn;
    setBellOn(newState);
    localStorage.setItem('dozy-bell-enabled', newState.toString());
  };
  
  const meditationSuggestions = [
    { id: 1, title: 'Quick Breath', duration: '1 min', description: 'A quick breathing exercise to center yourself.' },
    { id: 2, title: 'Body Scan', duration: '3 min', description: 'Bring awareness to each part of your body.' },
    { id: 3, title: 'Mindful Minute', duration: '1 min', description: 'One minute of complete presence and awareness.' },
    { id: 4, title: 'Focus Boost', duration: '2 min', description: 'Sharpen your concentration before a work session.' },
  ];
  
  return (
    <>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dozy-surface-dark/80 backdrop-blur-sm py-3 px-4 flex justify-center items-center space-x-6 z-10 border-t border-gray-100 dark:border-gray-800"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <button 
          onClick={toggleSound}
          className="p-2 rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-700/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)] transition-all duration-200"
          aria-label={soundOn ? 'Turn off ambient sound' : 'Turn on ambient sound'}
        >
          {soundOn ? <FaVolumeUp className="text-dozy-sage" /> : <FaVolumeMute />}
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-700/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)] transition-all duration-200"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-dozy-sage" />}
        </button>
        
        {spotifyConnected && (
          <button 
            className="p-2 rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-700/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)] transition-all duration-200"
            aria-label="Open Spotify controls"
          >
            <FaSpotify className="text-green-500" />
          </button>
        )}
        
        <button 
          onClick={() => setShowMeditationModal(true)}
          className="p-2 rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-700/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)] transition-all duration-200"
          aria-label="Meditation suggestions"
        >
          <FaSpa className="text-dozy-sage" />
        </button>
        
        <button 
          onClick={toggleBell}
          className="p-2 rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-700/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)] transition-all duration-200"
          aria-label={bellOn ? 'Turn off Pomodoro bell' : 'Turn on Pomodoro bell'}
        >
          <FaBell className={bellOn ? 'text-dozy-peach' : 'text-gray-400'} />
        </button>
      </motion.div>
      
      {/* Meditation Modal */}
      <AnimatePresence>
        {showMeditationModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMeditationModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-dozy-surface-dark rounded-3xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(93,187,138,0.2)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Quick Meditation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Take a moment to center yourself with these quick exercises.</p>
              
              <div className="space-y-3 mb-6">
                {meditationSuggestions.map(suggestion => (
                  <motion.button
                    key={suggestion.id}
                    className="w-full text-left p-4 bg-dozy-sage-light/50 dark:bg-dozy-sage/20 rounded-2xl hover:bg-dozy-sage-light/80 dark:hover:bg-dozy-sage/30 hover:shadow-[0_0_15px_rgba(93,187,138,0.3)] transition-all duration-200"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <span className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded-full">{suggestion.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="btn-ghost"
                  onClick={() => setShowMeditationModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomUtilitiesBar;