import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Send, CheckCircle2, Loader2 } from 'lucide-react';
import CodeEditor from '../components/editor/CodeEditor';
import { useTracker } from '../context/TrackerContext';
import { cn } from '../lib/utils';
import api from '../services/api';


const PROBLEM_DATA = {
  1: {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`
  },
   2: {
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    
};`
  }
};

const ProblemSolve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStatus } = useTracker();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
        try {
            const { data } = await api.get(`/dsa/${id}`);
            setProblem(data);
            setCode(data.starterCode || '// Write your code here');
        } catch (err) {
            setError('Failed to load problem.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchProblem();
  }, [id]);

  const handleRun = () => {
    setOutput('Running...\n\nResult: [0, 1]\nExpected: [0, 1]\n\nTest Passed!');
  };

  const handleSubmit = () => {
    setOutput('Submitting...\n\nAccepted! Runtime: 56ms, Memory: 42.1MB');
    updateStatus(id, 'Solved');
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (error || !problem) return <div className="h-screen flex items-center justify-center text-destructive">{error || "Problem not found"}</div>;

  return (
    <div className="h-full flex flex-col gap-4">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/dsa')}
                className="p-2 hover:bg-accent rounded-full transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-xl font-bold flex items-center gap-3">
                    {problem.title}
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", 
                        problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                        {problem.difficulty}
                    </span>
                </h1>
            </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleRun}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 font-medium text-sm"
            >
                <Play size={16} />
                Run
            </button>
            <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm shadow-lg shadow-green-500/20"
            >
                <Send size={16} />
                Submit
            </button>
        </div>
      </div>

      {}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 bg-background">
        
        {}
        <div className="bg-card border border-border rounded-xl p-6 overflow-y-auto">
            <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="whitespace-pre-wrap text-muted-foreground mb-6">
                    {problem.description}
                </div>

                {problem.examples && problem.examples.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">Examples</h3>
                        <div className="space-y-4 mb-6">
                            {problem.examples.map((ex, idx) => (
                                <div key={idx} className="bg-muted p-4 rounded-lg text-sm font-mono">
                                    <p><span className="text-muted-foreground">Input:</span> {ex.input}</p>
                                    <p><span className="text-accent-foreground">Output:</span> {ex.output}</p>
                                    {ex.explanation && <p className="text-muted-foreground mt-1">Explanation: {ex.explanation}</p>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                     <>
                        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                            {problem.constraints.map((c, idx) => (
                                <li key={idx}>{c}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>

        {}
        <div className="flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
                <CodeEditor code={code} setCode={setCode} />
            </div>
            {output && (
                <div className="h-48 bg-card border border-border rounded-xl p-4 overflow-auto font-mono text-sm">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Execution Result</span>
                    </div>
                    <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
