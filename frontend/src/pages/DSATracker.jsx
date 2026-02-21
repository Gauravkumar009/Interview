import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import QuestionList from '../components/tracker/QuestionList';
import AddQuestionModal from '../components/tracker/AddQuestionModal';

const DSATracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DSA Tracker</h1>
          <p className="text-muted-foreground mt-2">Track your progress and revisit important problems.</p>
        </div>
        <div className="flex items-center gap-3">
            {}
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      <QuestionList />

      <AddQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </motion.div>
  );
};

export default DSATracker;
