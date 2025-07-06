import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NotesPanel = () => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('dozy-notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [notes]);

  // Auto-save notes with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (notes.trim() !== '') {
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('dozy-notes', notes);
        setIsSaving(false);
      }, 1000);
    } else {
      localStorage.removeItem('dozy-notes');
      setIsSaving(false);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes]);

  const handleChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <motion.div
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notes</h2>
        <motion.div 
          className="text-sm text-gray-500 dark:text-gray-400"
          animate={{ opacity: isSaving ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isSaving ? 'Saving...' : 'Saved'}
        </motion.div>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-dozy-sage dark:focus:ring-dozy-sage-dark focus:shadow-[0_0_10px_rgba(93,187,138,0.3)] min-h-[150px] resize-none transition-all duration-200"
          placeholder="Jot down your thoughts, ideas, or reflections…"
          value={notes}
          onChange={handleChange}
        />
        
        {/* Animated gradient border on focus */}
        <motion.div 
          className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent"
          initial={{ opacity: 0 }}
          whileFocus={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `linear-gradient(45deg, #5DBB8A, #4A9570, #102A43) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Your notes are saved automatically and stored locally on your device.</p>
      </div>
    </motion.div>
  );
};

export default NotesPanel;