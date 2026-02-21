import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

const MockInterview = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    
    const [interviewType, setInterviewType] = useState('Technical');
    const [rating, setRating] = useState(5);
    const [feedbackText, setFeedbackText] = useState('');
    const [areas, setAreas] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
    const [aiHistory, setAiHistory] = useState([]);
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
        fetchAiHistory();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const { data } = await api.get('/interview');
            setFeedbacks(data);
        } catch (err) {
            console.error("Failed to fetch feedbacks", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiHistory = async () => {
        setLoadingAi(true);
        try {
            const { data } = await api.get('/ai/history');
            setAiHistory(data);
        } catch (err) {
            console.error("Failed to fetch AI history", err);
        } finally {
            setLoadingAi(false);
        }
    };

    // ... existing handlers ...

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Mock Interviews
                    </h1>
                    <p className="text-muted-foreground mt-1">Track your performance and feedback.</p>
                </div>
                
                {activeTab === 'manual' && (
                    <button 
                        onClick={() => {
                            resetForm();
                            setShowForm(!showForm);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium text-sm"
                    >
                        <Plus size={16} />
                        {showForm ? 'Close Form' : 'Add Feedback'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
                <button
                    onClick={() => setActiveTab('manual')}
                    className={cn(
                        "pb-3 px-1 text-sm font-medium transition-all relative",
                        activeTab === 'manual' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Manual Feedback
                    {activeTab === 'manual' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={cn(
                        "pb-3 px-1 text-sm font-medium transition-all relative",
                        activeTab === 'ai' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    AI Sessions
                    {activeTab === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
            </div>

            {activeTab === 'manual' ? (
                <>
                    {showForm && (
                        <div className="bg-card border border-border p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                            {/* ... Form Content ... */}
                             <h3 className="text-lg font-semibold mb-4">
                                {editingId ? 'Edit Feedback' : 'New Feedback Entry'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <select 
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                                            value={interviewType}
                                            onChange={(e) => setInterviewType(e.target.value)}
                                        >
                                            <option>Technical</option>
                                            <option>HR</option>
                                            <option>Behavioral</option>
                                            <option>System Design</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Rating (1-10)</label>
                                        <input 
                                            type="number" 
                                            min="1" max="10"
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Feedback / Notes</label>
                                    <textarea 
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none h-24 resize-none"
                                        placeholder="What went well? What didn't?"
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Areas of Improvement (comma separated)</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                                        placeholder="e.g., Graphs, Communication, System Design"
                                        value={areas}
                                        onChange={(e) => setAreas(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                     <button 
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Update Entry' : 'Save Entry')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feedbacks.map((item) => (
                                <div key={item._id} className="relative bg-card border border-border p-5 rounded-xl hover:shadow-md transition-shadow group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-start mb-3 pr-16">
                                        <span className={cn("px-2 py-1 rounded text-xs font-semibold", 
                                            item.interviewType === 'Technical' ? "bg-blue-500/10 text-blue-500" :
                                            item.interviewType === 'HR' ? "bg-purple-500/10 text-purple-500" :
                                            "bg-orange-500/10 text-orange-500"
                                        )}>
                                            {item.interviewType}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                            <Star size={14} fill="currentColor" />
                                            {item.rating}
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground mb-4 line-clamp-3">
                                        {item.feedback}
                                    </p>
                                    {item.areasOfImprovement && item.areasOfImprovement.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.areasOfImprovement.map((area, idx) => (
                                                <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {feedbacks.length === 0 && !loading && (
                                 <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                                    <MessageSquare className="mx-auto mb-2 opacity-20" size={48} />
                                    <p>No interview feedback recorded yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
                    {loadingAi ? (
                        <div className="col-span-full py-12 flex justify-center">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : aiHistory.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                            <MessageSquare className="mx-auto mb-2 opacity-20" size={48} />
                            <p>No AI interview sessions found. Start one in the AI Interview section!</p>
                        </div>
                    ) : (
                        aiHistory.map((session) => (
                            <div key={session._id} className="bg-card border border-border p-6 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            {session.title || `${session.interviewType} Interview`}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {session.domain && <span className="mr-2 font-medium text-primary">{session.domain}</span>}
                                            {new Date(session.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg font-bold text-sm">
                                        <Star size={14} fill="currentColor" />
                                        {session.overallRating}
                                    </div>
                                </div>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {session.questions.slice(0, 3).map((q, idx) => (
                                        <div key={idx} className="text-sm border-l-2 border-primary/20 pl-3">
                                            <p className="font-semibold text-foreground mb-1">Q: {q.question}</p>
                                            <p className="text-muted-foreground line-clamp-2">A: {q.answer}</p>
                                        </div>
                                    ))}
                                    {session.questions.length > 3 && (
                                        <p className="text-xs text-muted-foreground italic text-center">
                                            + {session.questions.length - 3} more questions
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MockInterview;
