import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaClipboardCheck, FaStickyNote, FaChartBar, FaLeaf, FaTimes } from 'react-icons/fa';

const OnboardingModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome to DOZY',
      description: 'Your personal digital sanctuary for focus and mindfulness.',
      icon: <img src="/logo.svg" alt="DOZY" className="w-16 h-16" />,
    },
    {
      title: 'Focus Timer',
      description: 'Stay productive with our Pomodoro-style timer. Customize work and break intervals to match your workflow.',
      icon: <FaClock className="text-4xl text-dozy-sage" />,
    },
    {
      title: 'Task Management',
      description: 'Keep track of your tasks with our minimal to-do list. Check off items as you complete them.',
      icon: <FaClipboardCheck className="text-4xl text-dozy-sage" />,
    },
    {
      title: 'Quick Notes',
      description: 'Capture your thoughts and ideas in our distraction-free notes panel.',
      icon: <FaStickyNote className="text-4xl text-dozy-peach" />,
    },
    {
      title: 'Track Your Progress',
      description: 'View your productivity stats and achievements in the dashboard.',
      icon: <FaChartBar className="text-4xl text-dozy-sage" />,
    },
    {
      title: 'Mindful Mode',
      description: 'Our digital wellness assistant helps you stay focused and break free from distractions.',
      icon: <FaLeaf className="text-4xl text-dozy-sage" />,
    },
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-dozy-surface-dark rounded-3xl p-6 max-w-md w-full relative overflow-hidden shadow-[0_0_30px_rgba(93,187,138,0.2)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mb-8">
          <motion.div 
            className="bg-dozy-sage h-1 rounded-full"
            initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{steps[currentStep].description}</p>
        </motion.div>
        
        <div className="flex justify-between">
          <button 
            onClick={prevStep}
            className={`btn-ghost ${currentStep === 0 ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="btn-secondary"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;