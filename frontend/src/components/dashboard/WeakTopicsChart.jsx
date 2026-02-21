import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const WeakTopicsChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm h-[400px]"
    >
      <h3 className="text-lg font-bold mb-4">Topic Strength Analysis</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="topic" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Strength"
              dataKey="strength"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeakTopicsChart;
