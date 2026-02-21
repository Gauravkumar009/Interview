import React, { useState, useEffect } from 'react';
import { Building2, Search, TrendingUp, ChevronRight, BarChart3, Code2, Play, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Star, Users, ExternalLink, X, Terminal, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../services/api';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; 

const SUPPORTED_LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', ext: 'js', prismVal: languages.js },
    { id: 'python', name: 'Python', ext: 'py', prismVal: languages.python },
    { id: 'java', name: 'Java', ext: 'java', prismVal: languages.java },
    { id: 'cpp', name: 'C++', ext: 'cpp', prismVal: languages.cpp }
];

const COMPANIES = [
  {
    id: 1,
    name: 'Google',
    logo: 'G',
    color: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
    patterns: [
      { topic: 'Dynamic Programming', count: 45 },
      { topic: 'Graphs (BFS/DFS)', count: 38 },
      { topic: 'Trees & Tries', count: 25 },
      { topic: 'Two Pointers', count: 30 },
      { topic: 'String Manipulation', count: 20 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 2,
    name: 'Amazon',
    logo: 'A',
    color: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/20',
    patterns: [
      { topic: 'Arrays & Strings', count: 50 },
      { topic: 'Trees & BST', count: 42 },
      { topic: 'System Design', count: 30 },
      { topic: 'Top K Elements', count: 25 },
      { topic: 'Object Oriented Design', count: 35 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 3,
    name: 'Microsoft',
    logo: 'M',
    color: 'from-green-500 to-green-600',
    shadow: 'shadow-green-500/20',
    patterns: [
      { topic: 'Arrays', count: 40 },
      { topic: 'LinkedList', count: 35 },
      { topic: 'Strings', count: 30 },
      { topic: 'Binary Search', count: 25 },
      { topic: 'Design Patterns', count: 20 },
    ],
    difficulty: 'Medium',
  },
   {
    id: 4,
    name: 'Uber',
    logo: 'U',
    color: 'from-zinc-100 to-zinc-400',
    shadow: 'shadow-zinc-500/20',
    patterns: [
      { topic: 'Graphs', count: 42 },
      { topic: 'DP on Grids', count: 35 },
      { topic: 'Heaps', count: 20 },
      { topic: 'Trie Data Structure', count: 18 },
      { topic: 'Segment Trees', count: 15 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 5,
    name: 'Meta',
    logo: 'M',
    color: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-600/20',
    patterns: [
      { topic: 'Dynamic Programming', count: 48 },
      { topic: 'Graph Theory', count: 45 },
      { topic: 'Design', count: 30 },
      { topic: 'Sliding Window', count: 35 },
      { topic: 'Merge Intervals', count: 25 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 6,
    name: 'Apple',
    logo: 'A',
    color: 'from-gray-500 to-gray-700',
    shadow: 'shadow-gray-500/20',
    patterns: [
      { topic: 'Arrays & Strings', count: 42 },
      { topic: 'Sorting & Searching', count: 35 },
      { topic: 'Linked Lists', count: 28 },
      { topic: 'Tree Traversal', count: 30 },
      { topic: 'Backtracking', count: 20 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 7,
    name: 'Netflix',
    logo: 'N',
    color: 'from-red-600 to-red-800',
    shadow: 'shadow-red-600/20',
    patterns: [
      { topic: 'System Design', count: 55 },
      { topic: 'Concurrency', count: 30 },
      { topic: 'API Design', count: 25 },
      { topic: 'Microservices', count: 35 },
      { topic: 'Streaming Protocols', count: 20 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 8,
    name: 'Adobe',
    logo: 'A',
    color: 'from-red-500 to-pink-600',
    shadow: 'shadow-red-500/20',
    patterns: [
      { topic: 'Dynamic Programming', count: 40 },
      { topic: 'Geometry', count: 25 },
      { topic: 'Strings', count: 30 },
      { topic: 'Matrix Operations', count: 35 },
      { topic: 'Bit Manipulation', count: 20 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 9,
    name: 'TCS',
    logo: 'T',
    color: 'from-blue-400 to-indigo-500',
    shadow: 'shadow-blue-400/20',
    patterns: [
      { topic: 'Arrays & Logic', count: 60 },
      { topic: 'SQL & DBMS', count: 50 },
      { topic: 'Basic Java', count: 40 },
      { topic: 'Number Theory', count: 55 },
      { topic: 'Pseudocode Parsing', count: 45 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 10,
    name: 'Wipro',
    logo: 'W',
    color: 'from-indigo-500 to-purple-600',
    shadow: 'shadow-indigo-500/20',
    patterns: [
      { topic: 'Quantitative Aptitude', count: 55 },
      { topic: 'Strings', count: 45 },
      { topic: 'Logical Reasoning', count: 40 },
      { topic: 'Pattern Printing', count: 50 },
      { topic: 'Flowcharts', count: 35 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 11,
    name: 'Infosys',
    logo: 'I',
    color: 'from-blue-700 to-cyan-600',
    shadow: 'shadow-blue-700/20',
    patterns: [
      { topic: 'Puzzle & Algorithms', count: 50 },
      { topic: 'Basic DS', count: 45 },
      { topic: 'Pseudocode', count: 35 },
      { topic: 'Output Tracing', count: 40 },
      { topic: 'String Parsing', count: 30 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 12,
    name: 'HCLTech',
    logo: 'H',
    color: 'from-blue-600 to-blue-800',
    shadow: 'shadow-blue-600/20',
    patterns: [
      { topic: 'Basic Algorithms', count: 45 },
      { topic: 'OOP Concepts', count: 40 },
      { topic: 'Arrays', count: 35 },
      { topic: 'Data Types', count: 30 },
      { topic: 'Exceptions Handling', count: 25 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 13,
    name: 'Tech Mahindra',
    logo: 'TM',
    color: 'from-red-600 to-red-700',
    shadow: 'shadow-red-600/20',
    patterns: [
      { topic: 'Strings', count: 40 },
      { topic: 'Logical Puzzles', count: 35 },
      { topic: 'SQL', count: 30 },
      { topic: 'Time & Work', count: 45 },
      { topic: 'Array Traversal', count: 25 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 14,
    name: 'Cognizant',
    logo: 'C',
    color: 'from-blue-700 to-indigo-800',
    shadow: 'shadow-blue-700/20',
    patterns: [
      { topic: 'Data Structures', count: 50 },
      { topic: 'Aptitude & Logic', count: 45 },
      { topic: 'Basic Java/C++', count: 40 },
      { topic: 'DBMS Queries', count: 35 },
      { topic: 'Number Series', count: 40 },
    ],
    difficulty: 'Easy',
  },
  {
    id: 15,
    name: 'Flipkart',
    logo: 'F',
    color: 'from-yellow-400 to-yellow-600',
    shadow: 'shadow-yellow-500/20',
    patterns: [
      { topic: 'Dynamic Programming', count: 45 },
      { topic: 'Graphs', count: 40 },
      { topic: 'System Design', count: 30 },
      { topic: 'Sliding Window', count: 35 },
      { topic: 'E-commerce LLD', count: 25 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 16,
    name: 'Zoho',
    logo: 'Z',
    color: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/20',
    patterns: [
      { topic: 'Advanced C/C++', count: 50 },
      { topic: 'Arrays & Strings', count: 45 },
      { topic: 'System Design (LLD)', count: 35 },
      { topic: 'Object Modelling', count: 40 },
      { topic: 'Pointers & Memory', count: 30 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 17,
    name: 'Swiggy',
    logo: 'S',
    color: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/20',
    patterns: [
      { topic: 'Graphs (Routing)', count: 45 },
      { topic: 'Heaps & Priority Q', count: 40 },
      { topic: 'Machine Coding', count: 35 },
      { topic: 'Dijkstra Algorithm', count: 30 },
      { topic: 'Rate Limiting', count: 20 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 18,
    name: 'Zomato',
    logo: 'Z',
    color: 'from-red-600 to-red-700',
    shadow: 'shadow-red-600/20',
    patterns: [
      { topic: 'Arrays & Logic', count: 40 },
      { topic: 'System Design', count: 35 },
      { topic: 'Dynamic Programming', count: 30 },
      { topic: 'API Design', count: 35 },
      { topic: 'Geolocation Logic', count: 25 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 19,
    name: 'Razorpay',
    logo: 'R',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
    patterns: [
      { topic: 'Machine Coding', count: 45 },
      { topic: 'API Design', count: 40 },
      { topic: 'Trees & Graphs', count: 30 },
      { topic: 'Idempotency', count: 35 },
      { topic: 'Transaction Logic', count: 25 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 20,
    name: 'Paytm',
    logo: 'P',
    color: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/20',
    patterns: [
      { topic: 'Arrays', count: 45 },
      { topic: 'Strings & HashMaps', count: 40 },
      { topic: 'System Design', count: 35 },
      { topic: 'Fintech LLD', count: 30 },
      { topic: 'SQL Optimizations', count: 25 },
    ],
    difficulty: 'Medium',
  },
  {
    id: 21,
    name: 'OLA',
    logo: 'O',
    color: 'from-green-400 to-green-600',
    shadow: 'shadow-green-500/20',
    patterns: [
      { topic: 'Graphs (Shortest Path)', count: 45 },
      { topic: 'Dynamic Programming', count: 40 },
      { topic: 'Design Patterns', count: 30 },
      { topic: 'Math & Geometry', count: 35 },
      { topic: 'Concurrency', count: 25 },
    ],
    difficulty: 'Medium',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CompanyPatterns = () => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [practiceMode, setPracticeMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [userCode, setUserCode] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [selectedDiff, setSelectedDiff] = useState("Easy");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState(false);
    
    // Terminal State
    const [customInput, setCustomInput] = useState("");
    const [terminalOutput, setTerminalOutput] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [activeTerminalTab, setActiveTerminalTab] = useState("input"); // "input" | "output"

    
    const filteredCompanies = (searchQuery || "").trim()
        ? COMPANIES.filter(company => 
            company.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
        : COMPANIES;

    const startPractice = async (topic) => {
        setLoading(true);
        setPracticeMode(true);
        setFeedback(null);
        setIsTimerActive(false);
        setTimeLeft(900); // Reset to 15 mins for each new problem
        setTerminalOutput("");
        setCustomInput("");
        setActiveTerminalTab("input");
        try {
            const { data } = await api.post('/ai/company-problem', {
                company: selectedCompany.name,
                topic,
                difficulty: selectedDiff,
                language: selectedLanguage?.name || 'JavaScript'
            });
            setCurrentProblem(data);
            setUserCode(data.starterCode || "// Write your solution here...");
            setIsTimerActive(true); // Start tracking time
        } catch (err) {
            console.error("Failed to generate problem", err);
            alert("Failed to generate problem. Is the AI service running?");
            setPracticeMode(false);
        } finally {
            setLoading(false);
        }
    };

    const submitSolution = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/ai/evaluate-code', {
                problem: currentProblem,
                code: userCode,
                language: selectedLanguage?.name || 'JavaScript'
            });
            setFeedback(data);
        } catch (err) {
            console.error("Evaluation failed", err);
            alert("Failed to evaluate code.");
        } finally {
            setLoading(false);
        }
    };

    const simulateCode = async () => {
        setIsSimulating(true);
        setActiveTerminalTab("output");
        setTerminalOutput("Running...");
        try {
            const { data } = await api.post('/ai/simulate-code', {
                code: userCode,
                language: selectedLanguage?.name || 'JavaScript',
                customInput: customInput
            });
            setTerminalOutput(data.output);
        } catch (err) {
            console.error("Simulation failed", err);
            setTerminalOutput("Error: Failed to execute code. Check connection.");
        } finally {
            setIsSimulating(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft <= 0) {
            setIsTimerActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    if (practiceMode) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col max-w-7xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setPracticeMode(false)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10"
                        >
                            <ArrowLeft size={24} className="text-muted-foreground" />
                        </button>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                                 {selectedCompany?.name} Interview
                                 <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                    {currentProblem?.topic}
                                 </span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={cn("text-sm font-mono border px-3 py-1 rounded",
                            timeLeft <= 180 ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" : "bg-white/5 text-muted-foreground border-white/10"
                        )}>
                            Time Left: {formattedTime}
                        </span>
                    </div>
                </div>

                {loading && !currentProblem ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                            <Loader2 className="animate-spin text-primary relative z-10" size={64} />
                        </div>
                        <p className="text-muted-foreground animate-pulse text-lg font-light">
                            AI is crafting your interview challenge...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pb-8">
                        {}
                        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
                                <h3 className="text-2xl font-bold mb-6 text-white">{currentProblem?.title}</h3>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{currentProblem?.description}</p>
                                
                                <div className="mt-8 space-y-6">
                                    <h4 className="font-semibold text-lg text-white/90 flex items-center gap-2">
                                        <Code2 size={20} className="text-primary" /> Invalid Examples
                                    </h4>
                                    {currentProblem?.examples?.map((ex, i) => (
                                        <div key={i} className="bg-[#0f0f11] border border-white/5 p-4 rounded-xl text-sm font-mono space-y-2">
                                            <div className="flex gap-4">
                                                <span className="text-blue-400 w-16 text-right font-bold">Input:</span>
                                                <span className="text-gray-300">{ex.input}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-green-400 w-16 text-right font-bold">Output:</span>
                                                <span className="text-gray-300">{ex.output}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-gray-500 w-16 text-right">Note:</span>
                                                <span className="text-gray-500 italic text-xs">{ex.explanation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <h4 className="font-semibold mb-3 text-white/90">Constraints:</h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {currentProblem?.constraints?.map((c, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {feedback && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn("p-8 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all", 
                                        feedback.isCorrect 
                                            ? "bg-green-500/10 border-green-500/30 shadow-green-500/10" 
                                            : "bg-red-500/10 border-red-500/30 shadow-red-500/10"
                                    )}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={cn("p-3 rounded-full", feedback.isCorrect ? "bg-green-500/20" : "bg-red-500/20")}>
                                            {feedback.isCorrect ? (
                                                <CheckCircle2 className="text-green-400" size={32} />
                                            ) : (
                                                <AlertCircle className="text-red-400" size={32} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={cn("font-bold text-xl", feedback.isCorrect ? "text-green-400" : "text-red-400")}>
                                                {feedback.isCorrect ? "Example Cases Passed!" : "Execution Failed"}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Star className={cn("w-4 h-4 fill-current", feedback.isCorrect ? "text-yellow-500" : "text-gray-600")} />
                                                <span className="text-sm font-medium text-white/80">Score: {feedback.score}/10</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5 text-sm">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">AI Feedback</span>
                                            <p className="text-gray-300 leading-relaxed">{feedback.feedback}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                                <span className="block text-xs uppercase text-white/50 mb-1 group-hover:text-primary/80 transition-colors">Time Complexity</span>
                                                <span className="font-mono text-primary font-bold">{feedback.timeComplexity}</span>
                                            </div>
                                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                                <span className="block text-xs uppercase text-white/50 mb-1 group-hover:text-primary/80 transition-colors">Space Complexity</span>
                                                <span className="font-mono text-primary font-bold">{feedback.spaceComplexity}</span>
                                            </div>
                                        </div>
                                        {feedback.improvement && (
                                            <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                                <span className="font-bold text-blue-400 block mb-2 relative z-10">🚀 Optimization Tip</span>
                                                <p className="text-blue-200/80 relative z-10">{feedback.improvement}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Panel: Editor & Terminal */}
                        <div className="flex flex-col h-[700px] bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5">
                            <div className="bg-[#252526] px-6 py-3 border-b border-[#333] flex justify-between items-center backdrop-blur-sm bg-opacity-95">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    <div className="h-4 w-px bg-white/10 mx-2"></div>
                                    <div className="flex items-center gap-2">
                                        <Code2 size={14} className="text-gray-400" />
                                        <select 
                                            value={selectedLanguage?.id || 'javascript'}
                                            onChange={(e) => {
                                                const newLang = SUPPORTED_LANGUAGES.find(l => l.id === e.target.value);
                                                setSelectedLanguage(newLang);
                                                // Optional: provide basic starter comment when language changes manually
                                                if (newLang.id === 'python') {
                                                    setUserCode(prev => prev.length < 100 && prev.includes('//') ? '# Write your solution here...' : prev);
                                                } else {
                                                    setUserCode(prev => prev.length < 100 && prev.includes('#') ? '// Write your solution here...' : prev);
                                                }
                                            }}
                                            className="bg-transparent text-sm font-medium text-gray-300 focus:outline-none appearance-none cursor-pointer hover:text-white transition-colors"
                                        >
                                            {SUPPORTED_LANGUAGES.map(lang => (
                                                <option key={lang.id} value={lang.id} className="bg-[#1e1e1e] text-white">
                                                    main.{lang.ext}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startPractice(currentProblem?.topic)}
                                        disabled={loading || isSimulating}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all border border-white/5 disabled:opacity-50"
                                    >
                                        <ArrowRight size={14} className="text-gray-400" />
                                        <span>Next Problem</span>
                                    </button>
                                    <button
                                        onClick={submitSolution}
                                        disabled={loading || isSimulating}
                                        className="bg-green-600/90 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} className="text-white" />}
                                        <span className="group-hover:translate-x-0.5 transition-transform">Submit Solution</span>
                                    </button>
                                </div>
                            </div>
                            {/* Editor Container */}
                            <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e] relative min-h-[300px]">
                                <Editor
                                    value={userCode}
                                    onValueChange={code => setUserCode(code)}
                                    highlight={code => {
                                        if (selectedLanguage?.prismVal) {
                                            return highlight(code, selectedLanguage.prismVal, selectedLanguage.id);
                                        }
                                        return code; // fallback
                                    }}
                                    padding={24}
                                    style={{
                                        fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                                        fontSize: 15,
                                        minHeight: '100%',
                                        lineHeight: '1.6',
                                    }}
                                    className="font-mono min-h-full"
                                    textareaClassName="focus:outline-none"
                                />
                            </div>

                            {/* Terminal Container */}
                            <div className="h-[240px] border-t border-white/10 bg-[#1e1e1e] flex flex-col shrink-0">
                                {/* Terminal Header */}
                                <div className="flex justify-between items-center bg-[#252526] px-4 py-2 border-b border-white/5 shrink-0">
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setActiveTerminalTab('input')}
                                            className={cn("px-4 py-1.5 text-xs font-semibold rounded-md transition-colors", 
                                                activeTerminalTab === 'input' ? "bg-[#37373d] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            Custom Input
                                        </button>
                                        <button 
                                            onClick={() => setActiveTerminalTab('output')}
                                            className={cn("px-4 py-1.5 text-xs font-semibold rounded-md transition-colors", 
                                                activeTerminalTab === 'output' ? "bg-[#37373d] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Terminal size={12} /> Console Output
                                            </span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={simulateCode}
                                        disabled={isSimulating || loading}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 ring-1 ring-white/10"
                                    >
                                        {isSimulating ? <Loader2 className="animate-spin" size={12} /> : <Play size={12} className="fill-current" />}
                                        Run Code
                                    </button>
                                </div>
                                {/* Terminal Body */}
                                <div className="flex-1 bg-[#18181b] overflow-hidden relative">
                                    {activeTerminalTab === 'input' ? (
                                        <textarea
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Enter standard input here (stdin)..."
                                            className="w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none outline-none focus:ring-inset focus:ring-1 focus:ring-white/10 placeholder:text-gray-600 custom-scrollbar"
                                            spellCheck={false}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#0d0d0f] text-gray-300 font-mono text-sm p-4 overflow-auto custom-scrollbar whitespace-pre-wrap">
                                            {isSimulating ? (
                                                <span className="text-gray-500 select-none animate-pulse">Executing code...</span>
                                            ) : terminalOutput ? (
                                                <span className={terminalOutput.toLowerCase().startsWith("error") ? "text-red-400" : "text-gray-300"}>
                                                    {terminalOutput}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 select-none italic">Run code to view output...</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="relative">
          {}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
            <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-3">
                    <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Company Patterns
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground/80 max-w-2xl font-light">
                    Crack the code to your dream job. Explore frequently asked topics by top tech giants and master their interview style.
                </p>
            </div>
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search companies..." 
                    className="w-full bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-lg hover:bg-white/10 text-white placeholder:text-muted-foreground/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
          </div>
      </div>

      <motion.div 
        key={searchQuery ? "filtered" : "all"}
        initial="hidden"
        animate="show"
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
      >
        <div className="col-span-full pb-2 text-sm text-gray-500 font-medium">
            Found {filteredCompanies.length} companies
        </div>
        {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
            <motion.div
                key={company.id}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedCompany(company)}
            >
                {}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-white/5 pointer-events-none")}></div>
                <div className={cn("absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity", company.color)}></div>

                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-1 ring-white/10 bg-gradient-to-br relative overflow-hidden group-hover:scale-110 transition-transform duration-300", company.color, company.shadow)}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            {company.logo}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors tracking-tight">{company.name}</h3>
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/5", 
                                company.difficulty === 'Hard' ? 'text-red-400 border-red-500/20 bg-red-500/5' : 
                                company.difficulty === 'Easy' ? 'text-green-400 border-green-500/20 bg-green-500/5' : ''
                            )}>
                                {company.difficulty}
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowLeft size={16} className="rotate-180" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                        <TrendingUp size={14} className="text-primary" /> Top Patterns
                    </h4>
                    {company.patterns.slice(0, 2).map((pattern, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group/item">
                            <span className="text-gray-300 group-hover/item:text-white transition-colors">{pattern.topic}</span>
                            <div className="flex items-center gap-2">
                                <span className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px]", 
                                    idx % 2 === 0 ? 'bg-red-500 shadow-red-500' : 'bg-yellow-500 shadow-yellow-500'
                                )} />
                                
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span>{company.patterns.reduce((acc, curr) => acc + curr.count, 0)}+ Questions</span>
                    <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">View All <ChevronRight size={12}/></span>
                </div>
            </motion.div>
            ))
        ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No companies found matching "{searchQuery}"</p>
            </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedCompany && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedCompany(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-[#18181b] border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {}
                    <div className="relative overflow-hidden bg-zinc-900/50 p-8 pb-12 border-b border-white/5">
                        <div className={cn("absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl opacity-10 blur-3xl pointer-events-none", selectedCompany.color)}></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-6">
                                    <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl bg-gradient-to-br ring-4 ring-[#18181b]", selectedCompany.color)}>
                                        {selectedCompany.logo}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold text-white mb-2">{selectedCompany.name}</h2>
                                        <p className="text-lg text-muted-foreground flex items-center gap-2">
                                            <Building2 size={18} /> Tech Giant Pattern Analysis
                                        </p>
                                    </div>
                                </div>
                                <a 
                                    href={`https://www.google.com/search?q=${encodeURIComponent(selectedCompany.name + ' algorithmic interview questions pattern')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/10 w-fit"
                                >
                                    <ExternalLink size={14} className="text-blue-400" />
                                    Search {selectedCompany.name} Interview Questions
                                </a>
                            </div>
                            <button 
                                onClick={() => setSelectedCompany(null)} 
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
                            >
                                <BarChart3 size={24} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {}
                    <div className="p-8 space-y-8 bg-[#18181b]">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-primary" /> 
                                Frequency Analysis
                            </h3>
                            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-lg border border-white/5">
                                {['Basic', 'Easy', 'Medium'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDiff(diff)}
                                        className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", 
                                            selectedDiff === diff 
                                            ? "bg-primary text-primary-foreground shadow-lg" 
                                            : "text-muted-foreground hover:text-white"
                                        )}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedCompany.patterns.map((pattern, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10 p-5 rounded-xl group transition-all"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{pattern.topic}</span>
                                    </div>
                                    
                                    <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(pattern.count / 65) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className={cn("h-full rounded-full bg-gradient-to-r", selectedCompany.color)} 
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                                            <Users size={14} /> {pattern.count} Questions
                                        </span>
                                        <button 
                                            onClick={() => startPractice(pattern.topic)}
                                            className="flex items-center gap-2 text-xs bg-white/5 hover:bg-primary hover:text-white text-white px-4 py-2 rounded-lg transition-all font-bold border border-white/5"
                                        >
                                            <Code2 size={14} />
                                            Solve with AI
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompanyPatterns;
