import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

const ResumeATS = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [resumeFile, setResumeFile] = useState(null);

    const handleAnalyze = async () => {
        if (!resumeText && !resumeFile) {
            setError('Please upload a resume (PDF) or paste the text.');
            return;
        }
        
        if (!jobDescription) {
            setError('Please paste the Job Description in the right-hand box.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            if (resumeText) formData.append('resumeText', resumeText);
            if (resumeFile) formData.append('resume', resumeFile);
            formData.append('jobDescription', jobDescription);

            const { data } = await api.post('/resume/analyze', formData);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Resume ATS Scanner
                    </h1>
                    <p className="text-muted-foreground mt-1">Check your resume score against job descriptions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-primary" />
                            Resume Input
                        </label>
                        
                        <div className="mb-4">
                            <div className="relative border-2 border-dashed border-border rounded-lg p-6 hover:bg-accent/50 transition-colors text-center cursor-pointer"
                                 onClick={() => document.getElementById('resume-upload').click()}
                            >
                                <input 
                                    type="file" 
                                    id="resume-upload" 
                                    className="hidden" 
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload size={24} />
                                    <span className="text-sm font-medium">
                                        {resumeFile ? resumeFile.name : "Click to upload PDF Resume"}
                                    </span>
                                    {!resumeFile && <span className="text-xs text-muted-foreground/70">Max 5MB (PDF only)</span>}
                                </div>
                            </div>
                            {resumeFile && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                                    className="text-xs text-destructive hover:underline mt-1 w-full text-center"
                                >
                                    Remove File
                                </button>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or paste text</span>
                            </div>
                        </div>

                        <textarea 
                            className="w-full h-32 mt-4 bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Paste your resume text manually..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                     <div className="bg-card border border-border p-4 rounded-xl h-full flex flex-col">
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-purple-500" />
                            Job Description
                        </label>
                        <textarea 
                            className="w-full flex-1 bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Paste the job description here..."
                             value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                 <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Analyze Score'}
                </button>

            </div>

            {error && (
                 <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2 justify-center">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-card border border-border p-8 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                             <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={result.score > 70 ? '#22c55e' : result.score > 40 ? '#eab308' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${result.score}, 100`}
                                    className="animate-[spin_1s_ease-out_reverse]"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold">{result.score}%</span>
                                <span className="text-xs text-muted-foreground">Match</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                     <CheckCircle size={18} className="text-green-500" />
                                     Matched Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchedKeywords.map((kw, i) => (
                                        <span key={i} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                                            {kw}
                                        </span>
                                    ))}
                                    {result.matchedKeywords.length === 0 && <span className="text-muted-foreground text-sm">No keywords matched.</span>}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                     <AlertCircle size={18} className="text-red-500" />
                                     Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeATS;
