import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, RotateCcw, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTracker } from '../../context/TrackerContext';

const StatusBadge = ({ status }) => {
  const styles = {
    Solved: 'bg-green-500/10 text-green-500 border-green-500/20',
    Revise: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Pending: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const icons = {
    Solved: CheckCircle,
    Revise: RotateCcw,
    Pending: Clock,
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", styles[status])}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const QuestionList = () => {
  const { questions, updateStatus, deleteQuestion } = useTracker();

  const handleStatusClick = (id, currentStatus) => {
    const nextStatus = {
      'Pending': 'Solved',
      'Solved': 'Revise',
      'Revise': 'Pending'
    };
    updateStatus(id, nextStatus[currentStatus] || 'Pending');
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Problem</th>
              <th className="p-4 font-medium">Topic</th>
              <th className="p-4 font-medium">Difficulty</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {questions.map((q) => (
                <motion.tr 
                  key={q._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <Link 
                      to={`/solve/${q._id}`}
                      className="font-medium hover:text-primary flex items-center gap-2 group"
                    >
                      {q.title}
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{q.topic}</td>
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs font-medium", 
                      q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                      q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    )}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-4 cursor-pointer select-none" onClick={() => handleStatusClick(q._id, q.status)}>
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => deleteQuestion(q._id)}
                        className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {questions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No questions added yet. Start tracking!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
