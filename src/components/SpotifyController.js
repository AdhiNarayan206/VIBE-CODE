import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpotify, FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa';

const SpotifyController = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(50);
  
  // Check if Spotify is connected from localStorage
  useEffect(() => {
    const spotifyConnected = localStorage.getItem('dozy-spotify-connected') === 'true';
    setIsConnected(spotifyConnected);
    
    // In a real app, this would initialize the Spotify Web Playback SDK
    // and set up event listeners for player state changes
    
    // Mock data for demo purposes
    if (spotifyConnected) {
      setCurrentTrack({
        name: 'Focus Flow',
        artist: 'Ambient Sounds',
        albumArt: 'https://via.placeholder.com/40',
        duration: 237, // seconds
        progress: 45, // seconds
      });
    }
  }, []);
  
  const togglePlayPause = () => {
    // In a real app, this would call the Spotify API to play/pause
    setIsPlaying(!isPlaying);
  };
  
  const skipTrack = (direction) => {
    // In a real app, this would call the Spotify API to skip tracks
    console.log(`Skip ${direction}`);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    // In a real app, this would call the Spotify API to change volume
  };
  
  if (!isConnected) return null;
  
  return (
    <motion.div 
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white/80 dark:bg-dozy-surface-dark/80 backdrop-blur-sm rounded-full py-2 px-4 shadow-md hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] flex items-center space-x-3 z-10 transition-all duration-200"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.3 }}
    >
      <FaSpotify className="text-green-500 text-lg" />
      
      {currentTrack && (
        <>
          <div className="hidden sm:block">
            <img 
              src={currentTrack.albumArt} 
              alt="Album art" 
              className="w-8 h-8 rounded-md"
            />
          </div>
          
          <div className="hidden sm:block max-w-[120px] truncate">
            <p className="text-sm font-medium truncate">{currentTrack.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentTrack.artist}</p>
          </div>
        </>
      )}
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => skipTrack('previous')}
          className="p-1 hover:text-dozy-sage transition-colors duration-200"
          aria-label="Previous track"
        >
          <FaStepBackward />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="p-1.5 bg-dozy-sage text-white rounded-full hover:bg-dozy-sage-dark hover:shadow-[0_0_10px_rgba(93,187,138,0.4)] transition-all duration-200"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>
        
        <button 
          onClick={() => skipTrack('next')}
          className="p-1 hover:text-dozy-sage transition-colors duration-200"
          aria-label="Next track"
        >
          <FaStepForward />
        </button>
      </div>
      
      <div className="hidden sm:flex items-center space-x-2">
        <FaVolumeUp className="text-sm text-gray-500 dark:text-gray-400" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-dozy-sage"
        />
      </div>
    </motion.div>
  );
};

export default SpotifyController;