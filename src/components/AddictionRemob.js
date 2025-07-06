import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaBell, FaRegClock, FaRegLightbulb } from 'react-icons/fa';

const AddictionRemob = () => {
  const [isActive, setIsActive] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [distractionScore, setDistractionScore] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [stats, setStats] = useState({
    focusedTime: 0,  // in seconds
    distractedTime: 0,  // in seconds
  });
  
  const idleTimerRef = useRef(null);
  const lastActiveRef = useRef(Date.now());
  const reminderTimeoutRef = useRef(null);
  
  const reminderMessages = [
    "Breathe. Let's stay on task.",
    "Gently bring your attention back.",
    "Remember your intention for today.",
    "One thing at a time. Focus on now.",
    "You're doing great. Keep going.",
  ];
  
  const suggestions = [
    { id: 1, text: "Try a 5-minute break", icon: <FaRegClock /> },
    { id: 2, text: "Take 3 deep breaths", icon: <FaLeaf /> },
    { id: 3, text: "Stretch for a moment", icon: <FaRegLightbulb /> },
    { id: 4, text: "Drink some water", icon: <FaRegLightbulb /> },
  ];
  
  // Initialize and cleanup
  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('dozy-mindful-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is not visible, user might be distracted
        lastActiveRef.current = Date.now();
        if (isActive) {
          setTabSwitches(prev => prev + 1);
          updateDistractionScore(prev => prev + 5);
        }
      } else {
        // Tab is visible again
        const now = Date.now();
        const timeAway = (now - lastActiveRef.current) / 1000; // in seconds
        
        if (timeAway > 10 && isActive) {
          // If away for more than 10 seconds, count as distracted time
          setStats(prev => ({
            ...prev,
            distractedTime: prev.distractedTime + timeAway
          }));
          
          // Show a gentle reminder
          showReminderNotification();
        }
        
        lastActiveRef.current = now;
      }
    };
    
    const handleUserActivity = () => {
      const now = Date.now();
      const timeSinceLastActive = (now - lastActiveRef.current) / 1000; // in seconds
      
      if (timeSinceLastActive > 60 && isActive) {
        // If idle for more than a minute, count as distracted
        updateDistractionScore(prev => prev + 2);
        showReminderNotification();
      }
      
      lastActiveRef.current = now;
      setIdleTime(0);
    };
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });
    
    // Start idle timer
    if (isActive) {
      idleTimerRef.current = setInterval(() => {
        setIdleTime(prev => prev + 1);
        
        // Update focused time
        setStats(prev => ({
          ...prev,
          focusedTime: prev.focusedTime + 1
        }));
        
        // If idle for too long, might be distracted
        if (idleTime > 120) { // 2 minutes
          updateDistractionScore(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
      
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      
      // Save stats to localStorage
      localStorage.setItem('dozy-mindful-stats', JSON.stringify(stats));
    };
  }, [isActive, idleTime, stats]);
  
  const updateDistractionScore = (updater) => {
    setDistractionScore(updater);
    
    // Cap the distraction score between 0-100
    if (distractionScore > 100) setDistractionScore(100);
    if (distractionScore < 0) setDistractionScore(0);
  };
  
  const showReminderNotification = () => {
    // Pick a random message
    const message = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
    setReminderMessage(message);
    setShowReminder(true);
    
    // Hide after 5 seconds
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
    
    reminderTimeoutRef.current = setTimeout(() => {
      setShowReminder(false);
    }, 5000);
  };
  
  const toggleActive = () => {
    setIsActive(prev => !prev);
    
    if (!isActive) {
      // Starting a new session
      lastActiveRef.current = Date.now();
      setIdleTime(0);
      setTabSwitches(0);
      setDistractionScore(0);
    } else {
      // Ending the session
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate focus percentage
  const totalTime = stats.focusedTime + stats.distractedTime;
  const focusPercentage = totalTime > 0 ? Math.round((stats.focusedTime / totalTime) * 100) : 100;
  
  return (
    <motion.div
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mindful Mode</h2>
        <button
          onClick={toggleActive}
          className={`px-4 py-2 rounded-xl flex items-center transition-all duration-200 ${isActive ? 'bg-dozy-sage text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <FaLeaf className="mr-2" />
          {isActive ? 'Active' : 'Activate'}
        </button>
      </div>
      
      {/* Reminder notification */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            className="mb-6 p-4 bg-dozy-sage-light dark:bg-dozy-sage/20 rounded-2xl flex items-center shadow-[0_0_15px_rgba(93,187,138,0.2)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FaBell className="text-dozy-sage mr-3" />
            <p>{reminderMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <h3 className="text-lg font-medium mb-3">Focus Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Focus Score</span>
                <span>{focusPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-dozy-sage h-2.5 rounded-full" 
                  style={{ width: `${focusPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Focused Time</p>
                <p className="text-xl font-bold">{formatTime(stats.focusedTime)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Distracted Time</p>
                <p className="text-xl font-bold">{formatTime(stats.distractedTime)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <h3 className="text-lg font-medium mb-3">Current Session</h3>
          {isActive ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Distraction Level</span>
                  <span>{distractionScore}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${distractionScore < 30 ? 'bg-dozy-sage' : distractionScore < 70 ? 'bg-dozy-peach' : 'bg-red-500'}`} 
                    style={{ width: `${distractionScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tab Switches</p>
                  <p className="text-xl font-bold">{tabSwitches}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Idle Time</p>
                  <p className="text-xl font-bold">{formatTime(idleTime)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
              <p>Activate Mindful Mode to start tracking</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200 mb-6">
        <h3 className="text-lg font-medium mb-3">Mindfulness Suggestions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map(suggestion => (
            <motion.div
              key={suggestion.id}
              className="p-3 bg-dozy-sage-light/50 dark:bg-dozy-sage/20 rounded-xl flex flex-col items-center text-center hover:shadow-[0_0_15px_rgba(93,187,138,0.3)] transition-all duration-200"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-dozy-sage text-xl mb-2">
                {suggestion.icon}
              </div>
              <p className="text-sm">{suggestion.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">Mindful Mode helps you stay focused by gently tracking your digital habits.</p>
        <p>All data is stored locally on your device and is never sent to any server.</p>
      </div>
    </motion.div>
  );
};

export default AddictionRemob;