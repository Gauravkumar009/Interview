import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; 

const CodeEditor = ({ code, setCode }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e] font-mono text-sm h-full">
      <div className="bg-[#2d2d2d] px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="text-muted-foreground text-xs">JavaScript</span>
        <span className="text-muted-foreground text-xs">Auto-saved</span>
      </div>
      <div className="h-[calc(100%-40px)] overflow-auto custom-scrollbar">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={code => highlight(code, languages.js)}
          padding={16}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: 'transparent',
            minHeight: '100%',
          }}
          className="min-h-full"
        />
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
