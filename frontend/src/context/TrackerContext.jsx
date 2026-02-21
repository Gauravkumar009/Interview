import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TrackerContext = createContext();

export const useTracker = () => useContext(TrackerContext);

export const TrackerProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchQuestions();
    } else {
        setQuestions([]);
    }
  }, [user]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dsa');
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (questionData) => {
    try {
      const { data } = await api.post('/dsa', {
        ...questionData,
        difficulty: questionData.difficulty || 'Easy',
        status: 'Pending'
      });
      setQuestions((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Failed to add question:", err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateStatus = async (id, newStatus) => {
    
    const previousQuestions = [...questions];
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
    );

    try {
      await api.put(`/dsa/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      
      setQuestions(previousQuestions);
    }
  };

  const deleteQuestion = async (id) => {
    
    const previousQuestions = [...questions];
    setQuestions((prev) => prev.filter((q) => q._id !== id));

    try {
      await api.delete(`/dsa/${id}`);
    } catch (err) {
      console.error("Failed to delete question:", err);
      
      setQuestions(previousQuestions);
    }
  };

  const getStats = () => {
      
      
      
      
      const solved = questions.filter(q => q.status === 'Solved').length;
      const total = questions.length;
      const accuracy = total > 0 ? Math.round((solved / total) * 100) : 0;
      
      
      const topicStats = {};
      questions.forEach(q => {
        if (!topicStats[q.topic]) {
            topicStats[q.topic] = { total: 0, solved: 0 };
        }
        topicStats[q.topic].total++;
        if (q.status === 'Solved') topicStats[q.topic].solved++;
      });

      const weakTopicsData = Object.keys(topicStats).map(topic => ({
        topic,
        strength: Math.round((topicStats[topic].solved / topicStats[topic].total) * 100)
      })).sort((a, b) => a.strength - b.strength).slice(0, 5);

      return {
          solved,
          total,
          accuracy,
          streak: 5, 
          weakTopics: weakTopicsData
      };
  };

  return (
    <TrackerContext.Provider value={{ 
        questions, 
        loading, 
        error, 
        addQuestion, 
        updateStatus, 
        deleteQuestion,
        getStats
    }}>
      {children}
    </TrackerContext.Provider>
  );
};
