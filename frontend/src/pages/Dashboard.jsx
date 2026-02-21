import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Trophy, TrendingUp, Zap } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import WeakTopicsChart from '../components/dashboard/WeakTopicsChart';

const Dashboard = () => {
  
  const stats = [
    { title: 'Questions Solved', value: '142', icon: CheckCircle2, color: 'bg-blue-500', trend: 12 },
    { title: 'Current Streak', value: '7 Days', icon: Zap, color: 'bg-yellow-500', trend: 0 },
    { title: 'Contest Rating', value: '1450', icon: Trophy, color: 'bg-purple-500', trend: 5 },
    { title: 'Accuracy', value: '85%', icon: Target, color: 'bg-green-500', trend: 2 },
  ];

  const weakTopicsData = [
    { topic: 'DP', strength: 30 },
    { topic: 'Graphs', strength: 45 },
    { topic: 'Trees', strength: 60 },
    { topic: 'Arrays', strength: 90 },
    { topic: 'Strings', strength: 85 },
    { topic: 'Greedy', strength: 50 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your preparation overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <WeakTopicsChart data={weakTopicsData} />
        </div>
        
        {}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Recommended Focus
            </h3>
            <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">Dynamic Programming</p>
                    <p className="text-sm text-muted-foreground mt-1">Solve 3 Medium problems to improve.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">Graph Traversals</p>
                    <p className="text-sm text-muted-foreground mt-1">Review BFS/DFS concepts.</p>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
