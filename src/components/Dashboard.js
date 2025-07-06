import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMedal, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import DigitalWellness from './DigitalWellness';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    today: {
      sessionsCompleted: 0,
      focusedTime: 0, // in minutes
      breakTime: 0, // in minutes
      tasksCompleted: 0
    },
    weekly: {
      sessions: [0, 0, 0, 0, 0, 0, 0], // Last 7 days
      focusTime: [0, 0, 0, 0, 0, 0, 0], // Last 7 days in minutes
    },
    achievements: []
  });

  // Load stats from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const loadStats = () => {
      // Sessions data
      const sessionsData = JSON.parse(localStorage.getItem('dozy-sessions') || '{}');
      const todaySessions = sessionsData[today] || 0;
      
      // Tasks data
      const tasksData = JSON.parse(localStorage.getItem('dozy-completed-tasks') || '{}');
      const todayTasks = tasksData[today] || 0;
      
      // Calculate weekly data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      const weeklySessions = last7Days.map(date => sessionsData[date] || 0);
      
      // Calculate focus time (estimate based on sessions)
      const workTime = parseInt(localStorage.getItem('dozy-work-time') || '1500') / 60; // Convert to minutes
      const breakTime = parseInt(localStorage.getItem('dozy-break-time') || '300') / 60; // Convert to minutes
      
      const todayFocusedTime = todaySessions * workTime;
      const todayBreakTime = todaySessions * breakTime;
      
      const weeklyFocusTime = weeklySessions.map(sessions => sessions * workTime);
      
      // Calculate achievements
      const achievements = [];
      
      if (todaySessions >= 1) {
        achievements.push({ id: 'first_session', title: 'First Session', icon: <FaClock /> });
      }
      
      if (todaySessions >= 4) {
        achievements.push({ id: 'productive_day', title: 'Productive Day', icon: <FaCalendarAlt /> });
      }
      
      if (todayTasks >= 5) {
        achievements.push({ id: 'task_master', title: 'Task Master', icon: <FaCheckCircle /> });
      }
      
      // Check for streak
      let streak = 0;
      let currentDate = new Date();
      
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (sessionsData[dateStr] && sessionsData[dateStr] >= 2) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      if (streak >= 3) {
        achievements.push({ id: 'focus_streak', title: `${streak} Day Streak`, icon: <FaMedal /> });
      }
      
      setStats({
        today: {
          sessionsCompleted: todaySessions,
          focusedTime: todayFocusedTime,
          breakTime: todayBreakTime,
          tasksCompleted: todayTasks
        },
        weekly: {
          sessions: weeklySessions,
          focusTime: weeklyFocusTime,
        },
        achievements
      });
    };
    
    loadStats();
  }, []);

  // Chart data for weekly sessions
  const weeklySessionsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Focus Sessions',
        data: stats.weekly.sessions,
        backgroundColor: 'rgba(93, 187, 138, 0.5)',
        borderColor: 'rgba(93, 187, 138, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for weekly focus time
  const weeklyFocusTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: stats.weekly.focusTime,
        backgroundColor: 'rgba(157, 193, 131, 0.5)',
        borderColor: 'rgba(157, 193, 131, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Chart data for focus vs break time
  const focusVsBreakData = {
    labels: ['Focus Time', 'Break Time'],
    datasets: [
      {
        data: [stats.today.focusedTime, stats.today.breakTime],
        backgroundColor: [
          'rgba(93, 187, 138, 0.7)',
          'rgba(157, 193, 131, 0.7)',
        ],
        borderColor: [
          'rgba(93, 187, 138, 1)',
          'rgba(157, 193, 131, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <motion.div
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Today's Stats */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Today's Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-dozy-sage text-2xl mb-2">
              <FaClock />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sessions</p>
            <p className="text-2xl font-bold">{stats.today.sessionsCompleted}</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-dozy-sage text-2xl mb-2">
              <FaClock />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Focus Time</p>
            <p className="text-2xl font-bold">{Math.round(stats.today.focusedTime)} min</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-dozy-sage text-2xl mb-2">
              <FaClock />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Break Time</p>
            <p className="text-2xl font-bold">{Math.round(stats.today.breakTime)} min</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-dozy-peach text-2xl mb-2">
              <FaCheckCircle />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tasks Done</p>
            <p className="text-2xl font-bold">{stats.today.tasksCompleted}</p>
          </motion.div>
        </div>
      </div>
      
      {/* Weekly Progress */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
            <h4 className="text-lg font-medium mb-2">Sessions</h4>
            <div className="h-60">
              <Bar data={weeklySessionsData} options={chartOptions} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
            <h4 className="text-lg font-medium mb-2">Focus Time</h4>
            <div className="h-60">
              <Line data={weeklyFocusTimeData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Focus vs Break Distribution */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Today's Distribution</h3>
        <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200">
          <div className="h-60">
            <Pie data={focusVsBreakData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        {stats.achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.achievements.map((achievement) => (
              <motion.div 
                key={achievement.id}
                className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-4 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200 flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-dozy-sage text-3xl mb-2">
                  {achievement.icon}
                </div>
                <p className="font-medium">{achievement.title}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dozy-surface-dark rounded-2xl p-6 shadow-sm hover:shadow-[0_0_15px_rgba(93,187,138,0.2)] transition-all duration-200 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Complete focus sessions and tasks to earn achievements!
            </p>
          </div>
        )}
      </div>
      
      {/* Digital Wellness */}
      <DigitalWellness />
    </motion.div>
  );
};

export default Dashboard;