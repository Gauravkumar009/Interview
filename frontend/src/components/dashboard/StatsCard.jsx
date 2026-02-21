import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const StatsCard = ({ title, value, icon: Icon, trend, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-full bg-opacity-10", color)}>
          <Icon size={24} className={cn("text-opacity-100", color.replace('bg-', 'text-'))} style={{ color: 'currentColor' }} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn("font-medium", trend >= 0 ? "text-green-500" : "text-red-500")}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-muted-foreground ml-2">from last week</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
