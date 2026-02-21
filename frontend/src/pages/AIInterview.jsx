import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Play, Sparkles, Loader2, StopCircle, Video, Mic, MicOff, Volume2, VolumeX, MessageSquare, Download, RefreshCw, History, ArrowLeft, Star, Trash2, Edit2, Save, X, FileText, Check, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import api, { BASE_URL } from '../services/api';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AIInterview = () => {
    const [started, setStarted] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const sessionIdRef = useRef(null); 
    const [interviewType, setInterviewType] = useState('Technical');
    const [domain, setDomain] = useState('');
    const [mode, setMode] = useState('text'); 
    const [timer, setTimer] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [viewHistory, setViewHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [openFolder, setOpenFolder] = useState(null); 
    
    
    const videoRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const synthesisRef = useRef(window.speechSynthesis);
    const recognitionRef = useRef(null);
    
    
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [uploading, setUploading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/ai/history');
            setHistoryData(data);
            setViewHistory(true);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSpeechSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript); 
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        }
    }, []);

    
    useEffect(() => {
        let interval;
        if (started && !showSummary) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started, showSummary]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (text) => {
        if (mode === 'video' && synthesisRef.current) {
            synthesisRef.current.cancel(); 
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthesisRef.current.speak(utterance);
        }
    };

    const startCameraAndRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                try {
                    await videoRef.current.play();
                } catch (e) {
                    console.error("Video play failed", e);
                }
            }
            
            
            chunksRef.current = [];
            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
                ? 'video/webm; codecs=vp9' 
                : 'video/webm';
            
            
            const options = MediaRecorder.isTypeSupported(mimeType) ? { mimeType } : {};
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'video/webm' });
                const currentSessionId = sessionIdRef.current || sessionId;
                
                alert(`Debug: Stop Recording. Blob: ${blob.size}, SessionID: ${currentSessionId}, Chunks: ${chunksRef.current.length}`);

                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);
                
                if (blob.size === 0) {
                    alert("Error: Recorded video is empty.");
                }

                stream.getTracks().forEach(track => track.stop());

                if (currentSessionId && blob.size > 0) {
                    setUploading(true);
                    
                    const formData = new FormData();
                    formData.append('sessionId', currentSessionId);
                    formData.append('video', blob, `session-${currentSessionId}.webm`);

                    try {
                        const response = await api.post('/upload', formData);
                        console.log("Video uploaded successfully:", response.data);
                        alert("Debug: Upload Success!"); 
                    } catch (err) {
                        console.error("Failed to upload video", err);
                        alert(`Debug: Upload Failed. ${err.response?.status} - ${err.response?.data?.message || err.message}`);
                    } finally {
                        setUploading(false);
                    }
                }
            };

            mediaRecorder.start(1000); 

        } catch (err) {
            console.error("Error accessing camera", err);
        }
    };

    const stopCameraAndRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (videoRef.current && videoRef.current.srcObject) {
            
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    
    useEffect(() => {
        if (started && mode === 'video') {
            startCameraAndRecording();
        } 
        return () => {
            
            if (started) { 
                stopCameraAndRecording(); 
            }
            synthesisRef.current?.cancel();
        };
    }, [started, mode]);

    const handleStart = async () => {
        if (!domain.trim()) {
            alert("Please enter your Domain / Expertise to start the interview.");
            return;
        }

        if (mode === 'video') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.error("Camera permission denied", err);
                alert("Camera and Microphone access is required for Video Mode. Please allow access to start the interview.");
                return;
            }
        }

        setLoading(true);
        setRecordedVideoUrl(null);
        setTimer(0);
        setShowSummary(false);
        try {
            const { data } = await api.post('/ai/start', { type: interviewType, mode, domain });
            setSessionId(data.sessionId);
            sessionIdRef.current = data.sessionId; 
            setMessages([
                { sender: 'ai', text: data.message },
                { sender: 'ai', text: data.question }
            ]);
            setStarted(true);
            if (mode === 'video') {
                setTimeout(() => {
                    speak(`${data.message}. ${data.question}`);
                }, 1000);
            }
        } catch (err) {
            console.error("Failed to start session", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = () => {
        setStarted(false);
        setShowSummary(true);
        stopCameraAndRecording();
    };

    const handleSend = async (manualInput = null) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() || !sessionId) return;

        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setLoading(true);

        try {
            const { data } = await api.post('/ai/answer', {
                sessionId,
                answer: textToSend
            });

            
            const aiResponse = [
                { 
                    sender: 'ai', 
                    text: data.feedback, 
                    isFeedback: true, 
                    rating: data.rating, 
                    improvement: data.improvement 
                },
                { sender: 'ai', text: `Next Question: ${data.nextQuestion}` }
            ];

            setMessages(prev => [...prev, ...aiResponse]);

            if (mode === 'video') {
                speak(`${data.feedback}. Next Question: ${data.nextQuestion}`);
            }

        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error analyzing your answer." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session? This cannot be undone.")) return;
        try {
            await api.delete(`/ai/session/${id}`);
            setHistoryData(prev => prev.filter(session => session._id !== id));
        } catch (err) {
            console.error("Failed to delete session", err);
            alert("Failed to delete session");
        }
    };

    const startEditing = (session) => {
        setEditingSessionId(session._id);
        setEditTitle(session.title || `${session.interviewType} Interview`);
    };

    const handleUpdateSession = async (id) => {
        try {
            const { data } = await api.put(`/ai/session/${id}`, { title: editTitle });
            setHistoryData(prev => prev.map(s => s._id === id ? { ...s, title: data.title } : s));
            setEditingSessionId(null);
        } catch (err) {
            console.error("Failed to update session", err);
            alert("Failed to update session");
        }
    };


    if (viewHistory) {
        
        const groupedHistory = historyData.reduce((acc, session) => {
            const type = session.interviewType || 'Other';
            if (!acc[type]) acc[type] = [];
            acc[type].push(session);
            return acc;
        }, {});

        return (
            <div className="h-[calc(100vh-2rem)] flex flex-col max-w-5xl mx-auto p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setViewHistory(false)}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className="text-2xl font-bold">Past Interview Sessions</h2>
                    </div>
                </div>

                <div className="overflow-y-auto pb-4">
                    {Object.keys(groupedHistory).length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No past sessions found. Start practicing!
                        </div>
                    )}

                    {!openFolder ? (
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {Object.entries(groupedHistory).map(([type, sessions]) => (
                                <div 
                                    key={type} 
                                    onClick={() => setOpenFolder(type)}
                                    className="bg-card border border-border p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 aspect-square hover:-translate-y-1"
                                >
                                    <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                        <Folder className="text-yellow-500 fill-yellow-500/20" size={48} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{type}</h3>
                                        <p className="text-sm text-muted-foreground">{sessions.length} Files</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-4">
                                <button 
                                    onClick={() => setOpenFolder(null)}
                                    className="p-1 hover:bg-accent rounded-full mr-2 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <Folder className="text-yellow-500" size={24} />
                                <span className="text-muted-foreground">History /</span> {openFolder}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedHistory[openFolder]?.map((session) => (
                                    <div key={session._id} className="bg-card border border-border p-6 rounded-xl hover:shadow-md transition-shadow group relative">
                                        
                                        {}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 mr-4">
                                                {editingSessionId === session._id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className="bg-background border border-primary rounded px-2 py-1 text-sm font-bold w-full outline-none"
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleUpdateSession(session._id)} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                                                            <Check size={16} />
                                                        </button>
                                                        <button onClick={() => setEditingSessionId(null)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                                            {session.title || `${session.interviewType} Interview`}
                                                            {session.videoUrl && <Video size={14} className="text-blue-500" />}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg font-bold text-sm">
                                                    <Star size={14} fill="currentColor" />
                                                    {session.overallRating}
                                                </div>
                                                
                                                {}
                                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => startEditing(session)}
                                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                                        title="Rename Session"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteSession(session._id)}
                                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                        title="Delete Session"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {session.videoUrl ? (
                                            <div className="mb-4 space-y-2">
                                                <div className="rounded-lg overflow-hidden border border-border bg-black">
                                                    <video 
                                                        src={`${BASE_URL}${session.videoUrl}`} 
                                                        controls 
                                                        className="w-full aspect-video object-contain"
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <a 
                                                        href={`${BASE_URL}${session.videoUrl}`}
                                                        download={`interview-${session._id}.webm`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <Download size={12} /> Download Recording
                                                    </a>
                                                </div>
                                            </div>
                                        ) : session.mode === 'video' ? (
                                            <div className="mb-4 p-4 rounded-lg border border-dashed border-border text-center text-muted-foreground bg-muted/20">
                                                <p className="text-sm">No recording available for this session.</p>
                                                <p className="text-xs opacity-70">Videos are only saved if recorded in the current version.</p>
                                            </div>
                                        ) : null}


                                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {session.questions.map((q, idx) => (
                                                <div key={idx} className="text-sm border-l-2 border-primary/20 pl-3">
                                                    <p className="font-semibold text-foreground mb-1">Q: {q.question}</p>
                                                    <p className="text-muted-foreground mb-2 line-clamp-2">A: {q.answer}</p>
                                                    {q.improvement && (
                                                        <p className="text-xs text-orange-500 font-medium">Tip: {q.improvement}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (showSummary) {
        return (
            <div className="h-[calc(100vh-2rem)] flex flex-col items-center justify-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-6 bg-card p-10 rounded-2xl border border-border shadow-xl w-full">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <Sparkles size={40} />
                    </div>
                    <h2 className="text-3xl font-bold">Interview Completed!</h2>
                    <p className="text-muted-foreground">
                        Great job practicing! You can now download your recorded session or review your feedback.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 bg-muted/50 rounded-xl">
                            <div className="text-2xl font-bold">{messages.filter(m => m.sender === 'user').length}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Questions Answered</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-xl">
                            <div className="text-2xl font-bold">{formatTime(timer)}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Duration</div>
                        </div>
                    </div>
                    
                    {uploading && (
                         <div className="flex items-center justify-center gap-2 text-blue-500 font-medium">
                            <Loader2 className="animate-spin" size={16} />
                            Uploading Session Video...
                         </div>
                    )}

                    {recordedVideoUrl && mode === 'video' && (
                        <a 
                            href={recordedVideoUrl} 
                            download={`interview-session-${new Date().toISOString()}.webm`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                        >
                            <Download size={18} />
                            Download Recording
                        </a>
                    )}

                    
                    <button 
                        onClick={() => setShowSummary(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 border border-border hover:bg-accent rounded-xl font-medium transition-colors"
                    >
                        <RefreshCw size={18} />
                        Start New Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-5xl mx-auto">
            {!started ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bot size={48} className="text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            AI Mock Interviewer
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-md mx-auto">
                            Practice your interview skills. Choose Text or Video mode for a realistic experience.
                        </p>
                    </div>

                    <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
                        <div className="grid grid-cols-2 gap-4 p-1 bg-muted/50 rounded-xl">
                            <button
                                onClick={() => setMode('text')}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    mode === 'text' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                <MessageSquare size={18} />
                                Text Chat
                            </button>
                            <button
                                onClick={() => setMode('video')}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    mode === 'video' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                <Video size={18} />
                                Video Mode
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Select Interview Type</label>
                            <select 
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                value={interviewType}
                                onChange={(e) => setInterviewType(e.target.value)}
                            >
                                <option value="Technical">Technical (Coding/System Design)</option>
                                <option value="HR">HR & Behavioral</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Domain / Expertise</label>
                            <input 
                                type="text"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Frontend, Backend, Data Science, Marketing, etc."
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            onClick={handleStart}
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
                            Start Session
                        </button>
                        <button 
                            onClick={fetchHistory}
                            className="w-full py-4 border border-border hover:bg-accent rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <History size={18} />
                            View Past Sessions
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
                    {}
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Bot size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Interviewer</h3>
                                <p className="text-xs text-muted-foreground">Session Active • {interviewType} • {mode === 'video' ? 'Video Mode' : 'Text Chat'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleEndSession}
                            className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 px-3 py-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <StopCircle size={16} />
                            End Session
                        </button>
                    </div>

                    {mode === 'video' ? (
                        <div className="flex-1 relative bg-black/95 overflow-hidden flex flex-col items-center justify-center">
                            {}
                            <div className="absolute inset-0 w-full h-full">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline
                                    muted 
                                    className="w-full h-full object-cover mirror" 
                                    style={{ transform: 'scaleX(-1)' }} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                            </div>

                            {}
                            
                            {}
                            <div className="absolute top-6 left-6 flex items-center gap-4 z-20">
                                <div className="flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-md text-xs font-bold tracking-widest shadow-lg animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    REC
                                </div>
                                <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-white/10">
                                    {formatTime(timer)}
                                </div>
                            </div>

                            {}
                            <div className="absolute top-6 right-6 z-30 flex flex-col items-center gap-4">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-3 w-48 transition-all hover:scale-105 hover:bg-black/60">
                                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_30px_-5px_rgba(var(--primary),0.4)] transition-all duration-300", 
                                        isListening ? "scale-90 border-primary/10" : "scale-100 animate-pulse border-primary/30")}>
                                        <Bot size={32} className={cn("text-primary transition-all duration-300", isListening ? "opacity-50" : "opacity-100")} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-1">AI Interviewer</h3>
                                        <div className="flex justify-center gap-1 h-1">
                                            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
                                {loading && (
                                    <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white flex items-center gap-2 animate-pulse">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-sm font-medium tracking-wide">Processing your answer...</span>
                                    </div>
                                )}
                                {isSpeaking && (
                                    <div className="bg-primary/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
                                        <Volume2 size={16} className="animate-pulse" />
                                        <span className="text-sm font-medium tracking-wide">AI Speaking...</span>
                                    </div>
                                )}
                            </div>

                            {/* Subtitles / Chat */}
                            <div className="absolute bottom-32 left-0 right-0 px-6 flex justify-center pointer-events-none">
                                <AnimatePresence mode='wait'>
                                    {messages.filter(m => m.sender === 'ai').slice(-1).map((msg, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="bg-black/60 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/10 max-w-3xl text-center shadow-2xl pointer-events-auto"
                                        >
                                            <p className="text-xl md:text-2xl font-medium text-white/95 leading-relaxed">
                                                "{msg.text}"
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
                                <button 
                                    onClick={toggleListening}
                                    className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 border-4",
                                        isListening 
                                            ? "bg-red-500 border-red-400 text-white shadow-red-500/20 animate-pulse" 
                                            : "bg-white border-white/50 text-black hover:bg-gray-100"
                                    )}
                                >
                                    {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                                </button>
                                
                                {/* Manual Send Fallback */}
                                {input.trim() && (
                                    <button 
                                        onClick={() => handleSend()}
                                        disabled={loading}
                                        className="w-12 h-12 rounded-full bg-primary text-white border border-white/10 flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg"
                                        title="Send Answer Manually"
                                    >
                                        <Send size={20} />
                                    </button>
                                )}

                                <button 
                                    onClick={handleEndSession}
                                    className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur text-red-500 border border-white/10 flex items-center justify-center hover:bg-gray-700/80 transition-all hover:text-red-400"
                                    title="End Interview"
                                >
                                    <StopCircle size={20} />
                                </button>
                            </div>

                        </div>
                    ) : (
                        
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background to-muted/20">
                                {messages.map((msg, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-4 max-w-[85%]",
                                            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                            msg.sender === 'ai' ? "bg-primary/10 text-primary" : "bg-purple-500/10 text-purple-500"
                                        )}>
                                            {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                            msg.sender === 'ai' 
                                                ? "bg-card border border-border rounded-tl-none" 
                                                : "bg-primary text-primary-foreground rounded-tr-none",
                                            msg.isFeedback ? "border-l-4 border-l-yellow-500 bg-yellow-500/5" : ""
                                        )}>
                                            {msg.isFeedback && (
                                                <div className="flex items-center gap-2 mb-2 text-yellow-600 font-bold text-xs uppercase tracking-wider">
                                                    <Sparkles size={12} />
                                                    Feedback
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                            {msg.improvement && (
                                                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                                    <span className="font-semibold text-foreground">To Improve:</span> {msg.improvement}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                <div className="flex gap-4 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                                        </div>
                                </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-card border-t border-border">
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        className="flex-1 bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary shadow-inner"
                                        placeholder="Type your answer here..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        disabled={loading}
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || loading}
                                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIInterview;
