import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

const TodoPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('dozy-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dozy-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newCompletedState = !task.completed;
        
        // If task is being marked as completed, show confetti
        if (newCompletedState) {
          setCompletedTaskId(id);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
          
          // Update stats
          const today = new Date().toISOString().split('T')[0];
          const completedTasks = JSON.parse(localStorage.getItem('dozy-completed-tasks') || '{}');
          completedTasks[today] = (completedTasks[today] || 0) + 1;
          localStorage.setItem('dozy-completed-tasks', JSON.stringify(completedTasks));
        }
        
        return { ...task, completed: newCompletedState };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <motion.div
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      
      <div className="flex mb-4">
        <input
          type="text"
          className="input flex-grow mr-2"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <motion.button
          className="btn-secondary"
          onClick={addTask}
          whileTap={{ scale: 0.95 }}
          disabled={newTask.trim() === ''}
        >
          <FaPlus />
        </motion.button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No tasks yet. Add one to get started!
            </motion.p>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                className={`flex items-center p-3 rounded-xl ${task.completed ? 'bg-gray-100 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} shadow-sm`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div className="relative">
                  <motion.button
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${task.completed ? 'bg-dozy-sage border-dozy-sage text-white' : 'border-dozy-sage'}`}
                    onClick={() => toggleTask(task.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {task.completed && <FaCheck className="text-xs" />}
                  </motion.button>
                  
                  {/* Confetti animation */}
                  {showConfetti && completedTaskId === task.id && (
                    <motion.div 
                      className="absolute -top-1 -left-1 -right-1 -bottom-1 pointer-events-none"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 2 }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-dozy-sage"
                          initial={{ 
                            x: 0, 
                            y: 0,
                            scale: 0
                          }}
                          animate={{ 
                            x: Math.random() * 60 - 30, 
                            y: Math.random() * 60 - 30,
                            scale: Math.random() * 1 + 0.5,
                            opacity: 0
                          }}
                          transition={{ 
                            duration: Math.random() * 1 + 1,
                            ease: "easeOut" 
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <p className={`ml-3 flex-grow ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {task.text}
                </p>
                
                <motion.button
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  onClick={() => deleteTask(task.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash />
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TodoPanel;