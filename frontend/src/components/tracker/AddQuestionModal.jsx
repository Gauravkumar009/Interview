import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTracker } from '../../context/TrackerContext';

const AddQuestionModal = ({ isOpen, onClose }) => {
  const { addQuestion } = useTracker();
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    difficulty: 'Easy',
    link: '',
    status: 'Pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.topic) return;
    addQuestion(formData);
    setFormData({ title: '', topic: '', difficulty: 'Easy', link: '', status: 'Pending' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0.95, opacity: 0 }}
           className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-lg"
           onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Add New Question</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Problem Title</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. Two Sum"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. Arrays, DP"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Solved">Solved</option>
                  <option value="Revise">Revise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link (Optional)</label>
              <input
                type="url"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="https://leetcode.com/..."
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddQuestionModal;
