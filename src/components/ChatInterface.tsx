
import { useState, useRef, useEffect } from 'react';
import { Send, Download, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIMode, Message } from '@/types/ai';

interface ChatInterfaceProps {
  mode: AIMode;
  messages: Message[];
  isGenerating: boolean;
  onSendMessage: (content: string) => void;
  onExport: (format: 'json' | 'txt' | 'csv') => void;
}

export const ChatInterface = ({ mode, messages, isGenerating, onSendMessage, onExport }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    onSendMessage(input.trim());
    setInput('');
    setStreamingContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  };

  const getModeConfig = (mode: AIMode) => {
    const configs = {
      writer: {
        placeholder: 'Describe what you want to write about...',
        examples: ['Write a blog post about AI', 'Create a product description', 'Draft an email'],
        color: 'from-blue-500 to-cyan-500',
      },
      rephraser: {
        placeholder: 'Paste the text you want to rephrase...',
        examples: ['Make this more professional', 'Simplify this paragraph', 'Improve clarity'],
        color: 'from-purple-500 to-pink-500',
      },
      explainer: {
        placeholder: 'What would you like me to explain?',
        examples: ['Explain quantum computing', 'How does blockchain work?', 'What is machine learning?'],
        color: 'from-green-500 to-teal-500',
      },
      search: {
        placeholder: 'Search for information or ask a question...',
        examples: ['Latest AI research', 'Compare programming languages', 'Best practices for UX'],
        color: 'from-orange-500 to-red-500',
      },
    };
    return configs[mode];
  };

  const config = getModeConfig(mode);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center`}>
              <span className="text-3xl">
                {mode === 'writer' && '✍️'}
                {mode === 'rephraser' && '🔄'}
                {mode === 'explainer' && '💡'}
                {mode === 'search' && '🔍'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </h3>
            <p className="text-gray-400 mb-8">Get started with these examples:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {config.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] p-4 rounded-2xl backdrop-blur-sm border
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500/20 shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-gray-100 border-white/10'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {isGenerating && streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-100">
                  <p className="whitespace-pre-wrap">{streamingContent}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={config.placeholder}
              className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none pr-16 backdrop-blur-sm focus:bg-white/10 focus:border-white/20 transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {messages.length > 0 && (
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onExport('txt')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Export as TXT"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
              <Button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{input.length} characters</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
