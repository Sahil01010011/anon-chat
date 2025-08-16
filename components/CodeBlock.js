'use client';

import React, { useState } from 'react'; // FIXED: Added React import

const CodeBlock = ({ code, lang = 'javascript' }) => {
  const [copied, setCopied] = useState(false);
  const [SyntaxHighlighter, setSyntaxHighlighter] = useState(null);
  const [style, setStyle] = useState(null);

  // Dynamically import syntax highlighter only on client side
  React.useEffect(() => {
    const loadSyntaxHighlighter = async () => {
      try {
        const { Prism: PrismSyntaxHighlighter } = await import('react-syntax-highlighter');
        const { oneDark } = await import('react-syntax-highlighter/dist/cjs/styles/prism');
        
        setSyntaxHighlighter(() => PrismSyntaxHighlighter);
        setStyle(oneDark);
      } catch (error) {
        console.error('Failed to load syntax highlighter:', error);
      }
    };

    loadSyntaxHighlighter();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show loading state while syntax highlighter is loading
  if (!SyntaxHighlighter || !style) {
    return (
      <div className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400 font-mono ml-2">{lang}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs transition-all duration-200"
          >
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-4">
          <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-400 font-mono ml-2">{lang}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs transition-all duration-200 hover:scale-105"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      
      {/* Code Content with Beautiful Syntax Highlighting */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={style}
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            padding: '1rem',
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            color: '#6b7280',
            backgroundColor: 'transparent',
            paddingRight: '1rem',
            minWidth: '3rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
