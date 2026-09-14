import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  ChevronRight, 
  ShieldCheck, 
  Zap,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { querySparkKnowledge } from './sparkKnowledge';

export default function SparkAssistant({
  currentInputs = {},
  currentMetrics = {},
  darkMode = true,
  _onNavigateTab
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'spark',
      text: "Hello! I am **SPARK**, your operational intelligence copilot for the Oil India Limited Baghewala CSS–SRP Digital Twin. How can I assist your engineering evaluation today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input on opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Natural assistant latency simulation
    setTimeout(() => {
      const responseText = querySparkKnowledge(text, currentInputs, currentMetrics);
      const sparkMsg = {
        id: Date.now() + 1,
        sender: 'spark',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, sparkMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { label: "What is this Digital Twin?", query: "What is this digital twin and how does it work?" },
    { label: "Is 212 bbl/d possible?", query: "Is 212 bbl/d production possible?" },
    { label: "CSS steam cycle physics", query: "Explain the Cyclic Steam Stimulation (CSS) process" },
    { label: "SRP pump kinematics", query: "How does the Sucker Rod Pump (SRP) work?" },
    { label: "All 12 tabs guide", query: "Show me navigation guide for all 12 pages" }
  ];

  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'spark',
        text: "Session refreshed. I am ready for any operational inquiries regarding the Baghewala CSS-SRP platform.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* ── FLOATING ATTRACTIVE TRIGGER BUTTON (FIXED BOTTOM RIGHT) ── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/85 dark:bg-zinc-900/90 text-amber-300 border border-amber-500/50 shadow-[0_4px_25px_rgba(245,158,11,0.35)] text-xs font-mono font-bold cursor-pointer hover:scale-105 transition-all duration-200 backdrop-blur-md animate-in fade-in slide-in-from-right-4 select-none spark-pill-shimmer"
            style={{ backgroundImage: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(251,191,36,0.3), rgba(245,158,11,0.15))' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            </span>
            <span className="tracking-wide">Ask SPARK AI</span>
          </div>
        )}

        <div className="relative">
          {/* Dual Concentric Expanding Radar Waves */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/50 pointer-events-none spark-radar-wave-1" />
              <div className="absolute inset-0 rounded-2xl border border-amber-300/40 pointer-events-none spark-radar-wave-2" />
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={
              "relative group w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl " +
              (isOpen 
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rotate-90 border border-white/20" 
                : "bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-zinc-950 hover:scale-110 active:scale-95 spark-floating-btn spark-energy-pulse border-2 border-amber-300/90 ring-4 ring-amber-500/25")
            }
            title="SPARK: Oil India Operational Copilot"
            aria-label="Open SPARK AI Assistant"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="relative flex items-center justify-center">
                {/* Micro Ambient Glow */}
                <div className="absolute inset-[-6px] rounded-2xl bg-amber-400/40 animate-pulse blur-xs" />
                
                {/* Orbiting Micro Energy Particle */}
                <div className="absolute w-full h-full pointer-events-none flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] spark-orbit-particle" />
                </div>

                <div className="relative flex items-center justify-center">
                  <Zap className="w-7 h-7 fill-zinc-950 stroke-zinc-950 drop-shadow-md transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                  <Sparkles className="w-4 h-4 text-white absolute -top-2 -right-2 animate-spin drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" style={{ animationDuration: '4s' }} />
                </div>
              </div>
            )}

            {/* Online Live Status Beacon */}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-zinc-950 shadow-[0_0_6px_#34d399]" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── SPARK CHAT POPUP WINDOW ── */}
      {isOpen && (
        <div 
          className={
            "fixed z-50 transition-all duration-300 ease-out flex flex-col rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 " +
            (isExpanded 
              ? "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[580px] h-[calc(100vh-80px)] max-h-[720px] " 
              : "bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[550px] max-h-[calc(100vh-120px)] ") +
            (darkMode 
              ? "bg-[#080b12]/96 border-amber-500/35 text-zinc-100 shadow-amber-950/20" 
              : "bg-white/98 border-slate-300 text-slate-900 shadow-2xl")
          }
        >
          {/* Header Bar */}
          <div className={
            "px-4 py-3.5 border-b flex items-center justify-between gap-3 " +
            (darkMode ? "bg-zinc-950/80 border-white/10" : "bg-slate-100/90 border-slate-200")
          }>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-[-2px] rounded-xl bg-amber-400/40 animate-ping opacity-60 pointer-events-none" />
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 flex items-center justify-center text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex-shrink-0 relative">
                  <Zap className="w-5 h-5 fill-zinc-950 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-sm tracking-wider uppercase leading-none text-white dark:text-white light:text-slate-900">
                    SPARK <span className="text-amber-400">AI</span>
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  Oil India Limited • Baghewala Twin Copilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title={isExpanded ? "Collapse view" : "Expand view"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title="Close SPARK"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Security Pill */}
          <div className={
            "px-4 py-1.5 border-b text-[10px] font-mono flex items-center justify-between " +
            (darkMode ? "bg-black/40 border-white/5 text-zinc-400" : "bg-slate-50 border-slate-200 text-slate-600")
          }>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Governed SCADA Knowledge Base
            </span>
            <span className="text-amber-400/90 font-bold">OIL-AI-PROV-1.0</span>
          </div>

          {/* Message Thread Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={"flex gap-2.5 " + (msg.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.sender === 'spark' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm " +
                  (msg.sender === 'user'
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-medium rounded-tr-none shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
                    : darkMode
                      ? "bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-line"
                      : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line")
                }>
                  <div className="prose prose-invert prose-xs max-w-none">
                    {msg.text.split('\n').map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <span className={
                    "text-[9px] font-mono mt-1.5 block text-right " +
                    (msg.sender === 'user' ? 'text-zinc-900/70 font-bold' : 'text-zinc-400')
                  }>
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className={
                  "rounded-2xl rounded-tl-none px-4 py-3 border flex items-center gap-1.5 " +
                  (darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-slate-100 border-slate-200")
                }>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-zinc-400 font-mono ml-2">Consulting Baghewala Knowledge Base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className={
            "p-2 border-t overflow-x-auto no-scrollbar flex items-center gap-1.5 " +
            (darkMode ? "bg-black/30 border-white/5" : "bg-slate-50 border-slate-200")
          }>
            <span className="text-[10px] font-mono font-bold text-amber-400 flex-shrink-0 px-1">
              QUICK:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className={
                  "text-[11px] font-sans px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer flex-shrink-0 flex items-center gap-1 " +
                  (darkMode 
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500/40" 
                    : "bg-white hover:bg-amber-50 border-slate-200 text-slate-700 hover:border-amber-400")
                }
              >
                <span>{p.label}</span>
                <ChevronRight className="w-3 h-3 text-amber-500" />
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className={
            "p-3 border-t flex items-center gap-2 " +
            (darkMode ? "bg-zinc-950 border-white/10" : "bg-white border-slate-200")
          }>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask SPARK about this website, CSS, SRP, physics..."
              className={
                "flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-sans outline-none transition-all " +
                (darkMode
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600")
              }
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={
                "p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer " +
                (inputValue.trim()
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50")
              }
              title="Send question to SPARK"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
