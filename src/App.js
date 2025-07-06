import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';

// Components
import Header from './components/Header';
import Timer from './components/Timer';
import TodoPanel from './components/TodoPanel';
import NotesPanel from './components/NotesPanel';
import SettingsPanel from './components/SettingsPanel';
import SpotifyController from './components/SpotifyController';
import BottomUtilitiesBar from './components/BottomUtilitiesBar';
import Dashboard from './components/Dashboard';
import AddictionRemob from './components/AddictionRemob';
import OnboardingModal from './components/OnboardingModal';
import DigitalWellness from './components/DigitalWellness';

function App() {
  const { darkMode } = useTheme();
  const [activePanel, setActivePanel] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if it's the user's first visit
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('dozy-first-visit') !== 'false';
    if (isFirstVisit) {
      setShowOnboarding(true);
      localStorage.setItem('dozy-first-visit', 'false');
    }
  }, []);

  const togglePanel = (panelName) => {
    if (activePanel === panelName) {
      setActivePanel(null);
    } else {
      setActivePanel(panelName);
    }
  };

  // Force dark mode class on document for consistent styling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="relative min-h-screen px-4 py-8 md:px-8 lg:px-16 overflow-hidden transition-colors duration-300 ease-in-out">
        {/* Animated background gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-dozy-lavender-light via-dozy-sage-light to-dozy-peach-light dark:from-dozy-sage/5 dark:via-dozy-background-dark/80 dark:to-dozy-background-dark opacity-30 dark:opacity-30 transition-opacity duration-300"></div>
        
        <Header togglePanel={togglePanel} activePanel={activePanel} />
        
        <main className="container mx-auto max-w-4xl">
          <motion.div 
            className="card mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Timer />
            
            <AnimatePresence mode="wait">
              {activePanel === 'todo' && (
                <TodoPanel key="todo" />
              )}
              
              {activePanel === 'notes' && (
                <NotesPanel key="notes" />
              )}
              
              {activePanel === 'settings' && (
                <SettingsPanel key="settings" />
              )}
              
              {activePanel === 'stats' && (
                <Dashboard key="stats" />
              )}
              
              {activePanel === 'mindful' && (
                <AddictionRemob key="mindful" />
              )}
              
              {activePanel === 'wellness' && (
                <DigitalWellness key="wellness" />
              )}
            </AnimatePresence>
          </motion.div>
        </main>
        
        <BottomUtilitiesBar />
        
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingModal onClose={() => setShowOnboarding(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;