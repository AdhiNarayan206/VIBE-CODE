import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const Timer = () => {
  // Default timer settings
  const defaultWorkTime = 25 * 60; // 25 minutes in seconds
  const defaultBreakTime = 5 * 60; // 5 minutes in seconds
  
  // States
  const [timeLeft, setTimeLeft] = useState(defaultWorkTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  // Refs
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  
  // Load settings from localStorage
  useEffect(() => {
    const savedWorkTime = localStorage.getItem('dozy-work-time');
    const savedBreakTime = localStorage.getItem('dozy-break-time');
    
    if (savedWorkTime) setWorkTime(parseInt(savedWorkTime));
    if (savedBreakTime) setBreakTime(parseInt(savedBreakTime));
    
    // Initialize timer with work time
    setTimeLeft(savedWorkTime ? parseInt(savedWorkTime) : defaultWorkTime);
    
    // Create audio element for timer completion sound
    audioRef.current = new Audio('/bell.mp3');
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play error:', e));
            }
            
            // Switch between work and break
            if (isWorkSession) {
              setCompletedSessions(prev => prev + 1);
              // Save session to localStorage for stats
              const today = new Date().toISOString().split('T')[0];
              const sessions = JSON.parse(localStorage.getItem('dozy-sessions') || '{}');
              sessions[today] = (sessions[today] || 0) + 1;
              localStorage.setItem('dozy-sessions', JSON.stringify(sessions));
              
              // Switch to break
              setIsWorkSession(false);
              return breakTime;
            } else {
              // Switch to work
              setIsWorkSession(true);
              return workTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isWorkSession, workTime, breakTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer controls
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? workTime : breakTime);
  };
  
  // Calculate progress percentage for the circular timer
  const totalTime = isWorkSession ? workTime : breakTime;
  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 120; // Circle radius is 120
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <motion.h1 
        className="text-3xl md:text-4xl mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to DOZY
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl mb-8 text-center text-gray-600 dark:text-gray-300 font-jakarta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Stay calm. Stay focused.
      </motion.p>
      
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Circular progress */}
        <svg className="absolute w-full h-full" viewBox="0 0 256 256">
          <circle 
            cx="128" 
            cy="128" 
            r="120" 
            fill="none" 
            stroke="#D6EBE0" 
            strokeWidth="8" 
            className="dark:opacity-20"
          />
          <motion.circle 
            cx="128" 
            cy="128" 
            r="120" 
            fill="none" 
            stroke={isWorkSession ? "#5DBB8A" : "#4A9570"} 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
            transform="rotate(-90 128 128)"
          />
        </svg>
        
        {/* Timer display */}
        <motion.div 
          className="text-center z-10"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl mb-2">
            {isWorkSession ? "Focus Session" : "Break Time"}
          </h2>
          <p className="text-5xl md:text-6xl font-bold mb-4">
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Sessions completed: {completedSessions}
          </p>
          
          {/* Timer controls */}
          <div className="flex space-x-4 justify-center">
            <motion.button
              className="btn-secondary rounded-full w-12 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(93,187,138,0.3)]"
              onClick={toggleTimer}
              whileTap={{ scale: 0.9 }}
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </motion.button>
            
            <motion.button
              className="btn-ghost rounded-full w-12 h-12 flex items-center justify-center hover:shadow-[0_0_10px_rgba(93,187,138,0.2)]"
              onClick={resetTimer}
              whileTap={{ scale: 0.9 }}
              disabled={isRunning}
            >
              <FaRedo />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Timer;