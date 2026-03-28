import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, QuickAction, getQuickActions, generateAIResponse } from '../utils/aiEngine';
import { UserRole } from '../types';

const roleColors: Record<UserRole, { bg: string; gradient: string; text: string; light: string; ring: string; button: string; bubbleBg: string }> = {
  administrator: {
    bg: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-indigo-700',
    text: 'text-indigo-600',
    light: 'bg-indigo-50',
    ring: 'ring-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    bubbleBg: 'bg-indigo-600',
  },
  doctor: {
    bg: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-emerald-700',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
    ring: 'ring-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    bubbleBg: 'bg-emerald-600',
  },
  nurse: {
    bg: 'bg-sky-600',
    gradient: 'from-sky-600 to-sky-700',
    text: 'text-sky-600',
    light: 'bg-sky-50',
    ring: 'ring-sky-500',
    button: 'bg-sky-600 hover:bg-sky-700',
    bubbleBg: 'bg-sky-600',
  },
  patient: {
    bg: 'bg-violet-600',
    gradient: 'from-violet-600 to-violet-700',
    text: 'text-violet-600',
    light: 'bg-violet-50',
    ring: 'ring-violet-500',
    button: 'bg-violet-600 hover:bg-violet-700',
    bubbleBg: 'bg-violet-600',
  },
};

function parseMarkdown(text: string): string {
  let html = text;
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h4 class="font-bold text-sm mt-3 mb-1">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="font-bold text-base mt-2 mb-2">$1</h3>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/_(.+?)_/g, '<em class="text-gray-500 text-xs">$1</em>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-2 border-gray-200" />');
  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    if (cells.every(c => /^[\s-]+$/.test(c))) return ''; // separator row
    const isHeader = cells.some(c => c.includes('---'));
    if (isHeader) return '';
    return `<div class="flex gap-2 text-xs py-0.5">${cells.map(c => `<span class="flex-1">${c.trim()}</span>`).join('')}</div>`;
  });
  // Bullet points
  html = html.replace(/^• (.+)$/gm, '<div class="flex items-start gap-1.5 ml-1 my-0.5"><span class="text-xs mt-0.5 opacity-60">•</span><span class="text-sm flex-1">$1</span></div>');
  // Line breaks
  html = html.replace(/\n\n/g, '<div class="h-2"></div>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

function MessageBubble({ message, roleColor }: { message: ChatMessage; roleColor: typeof roleColors.administrator }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      {!isUser && (
        <div className={`w-7 h-7 rounded-full ${roleColor.bg} flex items-center justify-center text-white text-xs flex-shrink-0 mr-2 mt-1 shadow-md`}>
          🤖
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
          isUser
            ? `${roleColor.bubbleBg} text-white rounded-br-md`
            : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
        }`}
      >
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <div
            className="leading-relaxed ai-content prose-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
          />
        )}
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/60' : 'text-gray-400'} text-right`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs flex-shrink-0 ml-2 mt-1 shadow">
          👤
        </div>
      )}
    </div>
  );
}

function TypingIndicator({ roleColor }: { roleColor: typeof roleColors.administrator }) {
  return (
    <div className="flex items-start mb-3 animate-fade-in">
      <div className={`w-7 h-7 rounded-full ${roleColor.bg} flex items-center justify-center text-white text-xs flex-shrink-0 mr-2 mt-1 shadow-md`}>
        🤖
      </div>
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ action, onClick, roleColor }: { action: QuickAction; onClick: () => void; roleColor: typeof roleColors.administrator }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-md whitespace-nowrap ${roleColor.light} border-gray-200 ${roleColor.text} hover:scale-[1.03] active:scale-95`}
    >
      <span>{action.icon}</span>
      <span>{action.label}</span>
    </button>
  );
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const role = user?.role || 'patient';
  const colors = roleColors[role];
  const quickActions = getQuickActions(role);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `## 👋 Hello, ${user?.name || 'there'}!

I'm your **MediCare AI Assistant**. I'm here to help you with your ${roleLabel} tasks.

Here are some things I can help you with — just click a quick action button or type your question below!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateAIResponse(query, role, user?.id || '');
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (!isOpen || isMinimized) {
        setHasNewMessage(true);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I'm sorry, I encountered an error processing your request. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    setMessages([]);
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `## 👋 Chat Cleared!

I'm ready for a fresh conversation. How can I help you with your ${roleLabel} tasks today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 w-14 h-14 ${colors.bg} text-white rounded-full shadow-2xl flex items-center justify-center z-[100] transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-3xl group`}
          title="Open AI Assistant"
        >
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            AI Assistant ✨
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-[100] transition-all duration-300 ease-out ${
            isMinimized
              ? 'bottom-6 right-6 w-72 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-[420px] h-[calc(100vh-6rem)] sm:h-[600px] max-h-[700px]'
          }`}
        >
          <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden h-full ${isMinimized ? '' : 'animate-slide-up'}`}>
            {/* Header */}
            <div className={`bg-gradient-to-r ${colors.gradient} text-white px-4 py-3 flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-3 cursor-pointer" onClick={isMinimized ? handleMinimize : undefined}>
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm">MediCare AI</h3>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online — Ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={handleMinimize}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMinimized ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Body (hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} roleColor={colors} />
                  ))}
                  {isTyping && <TypingIndicator roleColor={colors} />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 1 && !isTyping && (
                  <div className="px-4 pb-2 flex-shrink-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickActions.map((action) => (
                        <QuickActionButton
                          key={action.label}
                          action={action}
                          roleColor={colors}
                          onClick={() => handleSend(action.query)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions after messages */}
                {messages.length > 1 && !isTyping && (
                  <div className="px-4 pb-1 flex-shrink-0">
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {quickActions.slice(0, 3).map((action) => (
                        <QuickActionButton
                          key={action.label}
                          action={action}
                          roleColor={colors}
                          onClick={() => handleSend(action.query)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        disabled={isTyping}
                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${colors.ring}/30 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50`}
                      />
                    </div>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping}
                      className={`w-10 h-10 ${colors.button} text-white rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg active:scale-95`}
                    >
                      {isTyping ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-2">
                    MediCare AI • Powered by Hospital Intelligence
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
