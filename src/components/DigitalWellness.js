import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaBell, FaRegClock, FaRegLightbulb, FaMobileAlt, FaLaptop, FaRegChartBar } from 'react-icons/fa';

const DigitalWellness = () => {
  const [open, setOpen] = useState(false);
  const [habits, setHabits] = useState(null);
  const [nudge, setNudge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  // Mock data for habits analysis
  const mockHabits = {
    screenTime: {
      daily: 6.2, // hours
      weekly: 43.5,
      trend: 'increasing',
      breakdown: [
        { category: 'Social Media', percentage: 35 },
        { category: 'Productivity', percentage: 25 },
        { category: 'Entertainment', percentage: 30 },
        { category: 'Other', percentage: 10 }
      ]
    },
    appUsage: [
      { name: 'Instagram', timeSpent: 1.8, category: 'Social Media' },
      { name: 'Gmail', timeSpent: 1.2, category: 'Productivity' },
      { name: 'YouTube', timeSpent: 1.5, category: 'Entertainment' },
      { name: 'Spotify', timeSpent: 0.8, category: 'Entertainment' }
    ],
    pickups: {
      daily: 42,
      weekly: 294,
      trend: 'stable'
    },
    sleepImpact: {
      bedtimeDelay: 32, // minutes
      qualityReduction: 'moderate'
    },
    recommendations: [
      'Consider setting app time limits for Instagram',
      'Try to reduce phone pickups during work hours',
      'Avoid screen time 1 hour before bed'
    ]
  };
  
  // Mock personalized nudges
  const mockNudges = [
    'Taking a 20-minute nature walk could help reset your focus and reduce digital fatigue.',
    'Your evening screen time has increased by 30% this week. Consider reading a book instead tonight.',
    'You tend to check social media most frequently between 2-4pm. Try setting your phone to Do Not Disturb during this time.',
    'Your most productive hours are in the morning, but you often start the day with 30+ minutes of social media. Consider a different morning routine.'
  ];

  // Simulate analyzing habits
  const analyzeHabits = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setHabits(mockHabits);
    setIsLoading(false);
  };

  // Simulate getting personalized nudge
  const getPersonalizedNudge = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get random nudge from mock data
    const randomNudge = mockNudges[Math.floor(Math.random() * mockNudges.length)];
    setNudge(randomNudge);
    setIsLoading(false);
  };

  // Handle form submission for custom insights
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing user input
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a custom response based on input
    const customResponse = `Based on your concern about "${userInput}", consider setting specific boundaries around your digital usage in this area. Start with small changes and track your progress daily.`;
    
    setNudge(customResponse);
    setUserInput('');
    setIsLoading(false);
  };

  // Load data when sheet is opened
  useEffect(() => {
    if (open && !habits) {
      analyzeHabits();
    }
  }, [open, habits]);

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Digital Wellness</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl flex items-center transition-all duration-200 bg-dozy-sage text-white hover:shadow-[0_0_15px_rgba(93,187,138,0.4)]"
        >
          <FaLaptop className="mr-2" />
          Insights
        </button>
      </div>
      
      {/* Digital Wellness Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div 
              className="bg-white dark:bg-dozy-surface-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Digital Wellness Insights</h2>
                  <button 
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dozy-sage"></div>
                    </div>
                  ) : habits ? (
                    <>
                      {/* Screen Time Overview */}
                      <div className="bg-dozy-sage/10 dark:bg-dozy-sage/20 rounded-xl p-4">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <FaLaptop className="mr-2 text-dozy-sage" />
                          Screen Time Overview
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white dark:bg-dozy-surface-dark rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
                            <p className="text-2xl font-bold">{habits.screenTime.daily} hrs</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Trend: {habits.screenTime.trend === 'increasing' ? '↑' : habits.screenTime.trend === 'decreasing' ? '↓' : '→'}
                            </p>
                          </div>
                          
                          <div className="bg-white dark:bg-dozy-surface-dark rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Total</p>
                            <p className="text-2xl font-bold">{habits.screenTime.weekly} hrs</p>
                          </div>
                          
                          <div className="bg-white dark:bg-dozy-surface-dark rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Pickups</p>
                            <p className="text-2xl font-bold">{habits.pickups.daily}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Trend: {habits.pickups.trend === 'increasing' ? '↑' : habits.pickups.trend === 'decreasing' ? '↓' : '→'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Screen Time Breakdown */}
                        <div className="bg-white dark:bg-dozy-surface-dark rounded-lg p-3 shadow-sm">
                          <p className="text-sm font-medium mb-2">Usage Breakdown</p>
                          <div className="space-y-2">
                            {habits.screenTime.breakdown.map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{item.category}</span>
                                  <span>{item.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-dozy-sage h-2 rounded-full" 
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Top Apps */}
                      <div className="bg-white dark:bg-dozy-surface-dark rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <FaMobileAlt className="mr-2 text-dozy-sage" />
                          Top Apps
                        </h3>
                        
                        <div className="space-y-3">
                          {habits.appUsage.map((app, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-dozy-sage/20 flex items-center justify-center mr-3">
                                  <span className="text-dozy-sage">{app.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{app.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
                                </div>
                              </div>
                              <p className="font-medium">{app.timeSpent} hrs</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      <div className="bg-white dark:bg-dozy-surface-dark rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <FaRegLightbulb className="mr-2 text-dozy-sage" />
                          Recommendations
                        </h3>
                        
                        <ul className="space-y-2">
                          {habits.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-5 h-5 rounded-full bg-dozy-sage/20 text-dozy-sage flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Get Personalized Nudge */}
                      <div className="bg-white dark:bg-dozy-surface-dark rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-medium mb-3">Get Personalized Insight</h3>
                        
                        {nudge ? (
                          <div className="bg-dozy-sage/10 dark:bg-dozy-sage/20 rounded-lg p-4 mb-4">
                            <p className="italic">"{nudge}"</p>
                          </div>
                        ) : null}
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={getPersonalizedNudge}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg bg-dozy-sage text-white hover:shadow-[0_0_15px_rgba(93,187,138,0.4)] transition-all duration-200 disabled:opacity-50"
                          >
                            Get Random Insight
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                              <label htmlFor="userInput" className="block text-sm font-medium mb-1">
                                Ask for specific advice:
                              </label>
                              <textarea
                                id="userInput"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="e.g., How can I reduce my social media usage?"
                                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-dozy-sage/50 focus:border-transparent transition-all duration-200"
                                rows={3}
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isLoading || !userInput.trim()}
                              className="px-4 py-2 rounded-lg bg-dozy-sage text-white hover:shadow-[0_0_15px_rgba(93,187,138,0.4)] transition-all duration-200 disabled:opacity-50"
                            >
                              Get Custom Advice
                            </button>
                          </form>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">No data available. Click analyze to get started.</p>
                      <button
                        onClick={analyzeHabits}
                        className="px-4 py-2 rounded-lg bg-dozy-sage text-white hover:shadow-[0_0_15px_rgba(93,187,138,0.4)] transition-all duration-200"
                      >
                        Analyze Digital Habits
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Digital Wellness Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-dozy-sage/20 flex items-center justify-center mr-3">
              <FaLaptop className="text-dozy-sage" />
            </div>
            <h3 className="text-lg font-medium">Screen Time</h3>
          </div>
          <p className="text-3xl font-bold mb-1">6.2 hrs</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daily average</p>
        </div>
        
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-dozy-sage/20 flex items-center justify-center mr-3">
              <FaMobileAlt className="text-dozy-sage" />
            </div>
            <h3 className="text-lg font-medium">Pickups</h3>
          </div>
          <p className="text-3xl font-bold mb-1">42</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Times today</p>
        </div>
        
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-dozy-sage/20 flex items-center justify-center mr-3">
              <FaRegChartBar className="text-dozy-sage" />
            </div>
            <h3 className="text-lg font-medium">Top App</h3>
          </div>
          <p className="text-3xl font-bold mb-1">Instagram</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">1.8 hours today</p>
        </div>
      </div>
      
      {/* Wellness Tip */}
      <div className="bg-dozy-sage/10 dark:bg-dozy-sage/20 rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-dozy-sage/20 flex items-center justify-center mr-3 mt-1">
            <FaRegLightbulb className="text-dozy-sage" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Wellness Tip</h3>
            <p>Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce digital eye strain.</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">Digital Wellness helps you understand and improve your relationship with technology.</p>
        <p>All data is stored locally on your device and is never sent to any server.</p>
      </div>
    </div>
  );
};

export default DigitalWellness;