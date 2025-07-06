import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaVolumeUp, FaSpotify, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPanel = () => {
  const { darkMode, toggleDarkMode, enableAutoTheme } = useTheme();
  
  // Timer settings
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  // UI settings
  const [fontSize, setFontSize] = useState(100); // percentage
  const [autoTheme, setAutoTheme] = useState(false);
  
  // Sound settings
  const [soundVolume, setSoundVolume] = useState(50);
  const [ambientSound, setAmbientSound] = useState('none');
  const [enableAnimations, setEnableAnimations] = useState(true);
  
  // Spotify settings
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  // Load settings from localStorage
  useEffect(() => {
    // Timer settings
    const savedWorkTime = localStorage.getItem('dozy-work-time');
    const savedBreakTime = localStorage.getItem('dozy-break-time');
    
    if (savedWorkTime) setWorkMinutes(parseInt(savedWorkTime) / 60);
    if (savedBreakTime) setBreakMinutes(parseInt(savedBreakTime) / 60);
    
    // UI settings
    const savedFontSize = localStorage.getItem('dozy-font-size');
    const savedAutoTheme = localStorage.getItem('dozy-auto-theme');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedAutoTheme) setAutoTheme(savedAutoTheme === 'true');
    
    // Sound settings
    const savedSoundVolume = localStorage.getItem('dozy-sound-volume');
    const savedAmbientSound = localStorage.getItem('dozy-ambient-sound');
    const savedEnableAnimations = localStorage.getItem('dozy-enable-animations');
    
    if (savedSoundVolume) setSoundVolume(parseInt(savedSoundVolume));
    if (savedAmbientSound) setAmbientSound(savedAmbientSound);
    if (savedEnableAnimations) setEnableAnimations(savedEnableAnimations === 'true');
    
    // Spotify settings
    const savedSpotifyConnected = localStorage.getItem('dozy-spotify-connected');
    if (savedSpotifyConnected) setSpotifyConnected(savedSpotifyConnected === 'true');
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dozy-work-time', (workMinutes * 60).toString());
    localStorage.setItem('dozy-break-time', (breakMinutes * 60).toString());
    localStorage.setItem('dozy-font-size', fontSize.toString());
    localStorage.setItem('dozy-auto-theme', autoTheme.toString());
    localStorage.setItem('dozy-sound-volume', soundVolume.toString());
    localStorage.setItem('dozy-ambient-sound', ambientSound);
    localStorage.setItem('dozy-enable-animations', enableAnimations.toString());
    localStorage.setItem('dozy-spotify-connected', spotifyConnected.toString());
    
    // Apply font size to document root
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Update auto theme setting in context
    enableAutoTheme(autoTheme);
  }, [workMinutes, breakMinutes, fontSize, autoTheme, soundVolume, ambientSound, enableAnimations, spotifyConnected, enableAutoTheme]);
  
  const handleSpotifyConnect = () => {
    // In a real app, this would initiate OAuth flow
    alert('In a production app, this would connect to Spotify via OAuth.');
    setSpotifyConnected(!spotifyConnected);
  };
  
  return (
    <motion.div
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-8">
        {/* Timer Settings */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Timer</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Work Session Duration: {workMinutes} min</label>
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={workMinutes} 
                onChange={(e) => setWorkMinutes(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-dozy-sage"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Break Duration: {breakMinutes} min</label>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={breakMinutes} 
                onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-dozy-sage"
              />
            </div>
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Theme</span>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-dozy-sage" />}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Auto theme based on time</span>
              <button 
                onClick={() => setAutoTheme(!autoTheme)}
                className="text-2xl"
                aria-label={autoTheme ? 'Disable auto theme' : 'Enable auto theme'}
              >
                {autoTheme ? <FaToggleOn className="text-dozy-sage" /> : <FaToggleOff className="text-gray-400" />}
              </button>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Font Size: {fontSize}%</label>
              <input 
                type="range" 
                min="80" 
                max="120" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-dozy-sage"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span>Enable Animations</span>
              <button 
                onClick={() => setEnableAnimations(!enableAnimations)}
                className="text-2xl"
                aria-label={enableAnimations ? 'Disable animations' : 'Enable animations'}
              >
                {enableAnimations ? <FaToggleOn className="text-dozy-sage" /> : <FaToggleOff className="text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Sound Settings */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sound</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Volume: {soundVolume}%</label>
              <div className="flex items-center">
                <FaVolumeUp className="mr-2 text-gray-500" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={soundVolume} 
                  onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-dozy-sage"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Ambient Sound</label>
              <select 
                value={ambientSound}
                onChange={(e) => setAmbientSound(e.target.value)}
                className="input w-full"
              >
                <option value="none">None</option>
                <option value="rain">Rain</option>
                <option value="forest">Forest</option>
                <option value="cafe">Café</option>
                <option value="waves">Ocean Waves</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Spotify Integration */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Spotify Integration</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Connect to Spotify</span>
              <button 
                onClick={handleSpotifyConnect}
                className={`flex items-center px-4 py-2 rounded-xl ${spotifyConnected ? 'bg-green-500 text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-200 dark:bg-gray-700 hover:shadow-[0_0_15px_rgba(93,187,138,0.3)]'}`}
              >
                <FaSpotify className="mr-2" />
                {spotifyConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
            
            {spotifyConnected && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Your Spotify account is connected. You can now control playback from the bottom bar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;