import React from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaClipboardCheck, FaStickyNote, FaChartBar, FaLeaf, FaLaptop } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ togglePanel, activePanel }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { id: 'todo', icon: <FaClipboardCheck />, label: 'Tasks' },
    { id: 'notes', icon: <FaStickyNote />, label: 'Notes' },
    { id: 'stats', icon: <FaChartBar />, label: 'Stats' },
    { id: 'mindful', icon: <FaLeaf />, label: 'Mindful' },
    { id: 'wellness', icon: <FaLaptop />, label: 'Wellness' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <header className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/logo.svg" alt="DOZY" className="w-10 h-10 mr-3" />
          <h1 className="text-2xl font-bold">DOZY</h1>
        </motion.div>

        <motion.nav 
          className="hidden md:flex space-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={`px-3 py-2 rounded-xl flex items-center transition-all duration-200 ${activePanel === item.id ? 'bg-dozy-sage-light dark:bg-dozy-sage/30 text-dozy-sage-dark shadow-[0_0_10px_rgba(93,187,138,0.3)]' : 'hover:bg-gray-100/30 dark:hover:bg-gray-800/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)]'}`}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </motion.nav>

        {/* Mobile navigation */}
        <motion.div 
          className="md:hidden flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => togglePanel('mobile-menu')}
            className="p-2 rounded-xl hover:bg-gray-100/30 dark:hover:bg-gray-800/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)]"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </motion.div>

        {/* Mobile menu */}
        {activePanel === 'mobile-menu' && (
          <motion.div 
            className="absolute top-16 right-4 left-4 md:hidden bg-white dark:bg-dozy-surface-dark rounded-2xl shadow-soft dark:shadow-soft-dark z-50 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  togglePanel('mobile-menu');
                  togglePanel(item.id);
                }}
                className="w-full px-4 py-3 flex items-center hover:bg-gray-100/30 dark:hover:bg-gray-800/30 hover:shadow-[0_0_10px_rgba(93,187,138,0.2)]"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;