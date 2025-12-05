
import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Globe, Brain, Zap, ExternalLink, Sparkles, Terminal, Activity, Infinity } from 'lucide-react';
import { sendMessage, ChatConfig } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';
import ReactMarkdown from 'react-markdown';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig>({
    useSearch: false,
    useMaps: false,
    useThinking: false,
    useFast: false,
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSynchronicity, setIsSynchronicity] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request location for Maps Grounding
  useEffect(() => {
    if (config.useMaps && !config.userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setConfig(prev => ({ ...prev, userLocation: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } }));
        },
        (err) => console.error(err)
      );
    }
  }, [config.useMaps, config.userLocation]);

  const toggleSynchronicity = () => {
      const newState = !isSynchronicity;
      setIsSynchronicity(newState);
      if (newState) {
          // Activate all high-power modes
          setConfig({
              useThinking: true,
              useSearch: true, 
              useMaps: false,
              useFast: false
          });
      } else {
          setConfig({
            useSearch: false,
            useMaps: false,
            useThinking: false,
            useFast: false,
          });
      }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // If synchronicity is on, we force the Thinking model but might use Search tools too (if supported by logic)
      // Note: Thinking usually doesn't support tools yet in some implementations, but let's assume standard behavior or fallback.
      // For this "God Mode" feeling, we prioritize Thinking (Model 2.5/3 Pro).

      const result = await sendMessage(userMsg.text, history, {
          ...config,
          systemInstruction: SYSTEM_INSTRUCTIONS.ARA
      });
      // GenerateContentResponse has a getter 'text' that returns the string.
      const text = result.text || "";
      
      // Extract grounding metadata
      let groundingUrls: any[] = [];
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
             groundingUrls.push({ title: chunk.web.title, uri: chunk.web.uri, source: 'search' });
          }
          if (chunk.maps?.uri) {
             groundingUrls.push({ title: chunk.maps.title || "Map Location", uri: chunk.maps.uri, source: 'maps' });
          }
        });
      }

      const modelMsg: ChatMessage = { 
          role: 'model', 
          text, 
          isThinking: config.useThinking,
          groundingUrls
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Core processing error. Retrying recommended." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[100px]"></div>
      </div>

      {/* Header / Config */}
      <div className="p-4 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-md flex flex-wrap gap-2 items-center justify-between z-10">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isSynchronicity ? 'bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]' : 'bg-blue-500'}`}></div>
            <span className="text-slate-200 font-mono text-sm tracking-widest uppercase">Command Line</span>
            {isSynchronicity && <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">SYNC ACTIVE</span>}
        </div>
        <div className="flex gap-2">
            <button
            onClick={toggleSynchronicity}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                isSynchronicity 
                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
            >
            <Infinity size={14} className={isSynchronicity ? 'animate-spin-slow' : ''} /> SYNCHRONICITY
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            <button
            onClick={() => setConfig(p => ({ ...p, useSearch: !p.useSearch, useMaps: false, useThinking: false }))}
            className={`p-2 rounded-lg transition-colors ${
                config.useSearch ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Search Grounding"
            >
            <Globe size={16} />
            </button>
            <button
            onClick={() => setConfig(p => ({ ...p, useMaps: !p.useMaps, useSearch: false, useThinking: false }))}
            className={`p-2 rounded-lg transition-colors ${
                config.useMaps ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Maps Grounding"
            >
            <MapPin size={16} />
            </button>
            <button
            onClick={() => setConfig(p => ({ ...p, useThinking: !p.useThinking, useSearch: false, useMaps: false, useFast: false }))}
            className={`p-2 rounded-lg transition-colors ${
                config.useThinking ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Deep Thinking"
            >
            <Brain size={16} />
            </button>
            <button
            onClick={() => setConfig(p => ({ ...p, useFast: !p.useFast, useThinking: false }))}
            className={`p-2 rounded-lg transition-colors ${
                config.useFast ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Fast Mode"
            >
            <Zap size={16} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 z-10 scroll-smooth">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-600">
               <div className="w-24 h-24 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-ping-slow"></div>
                   <Activity size={40} className="text-blue-500/50" />
               </div>
               <p className="font-mono text-xl text-slate-300 tracking-tight">GMW 11 CORE</p>
               <p className="text-xs font-mono text-purple-400 mt-2 tracking-widest border border-purple-500/20 px-2 py-1 rounded bg-purple-900/10">v4.0 [DEC-2025] UPDATE INSTALLED</p>
               <p className="text-sm text-slate-500 mt-2 font-light max-w-md text-center">
                   Awareness of Kling 2.6, Runway Gen-4.5, Midjourney V7 & Grok 4.1 integrated.
               </p>
           </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 backdrop-blur-sm border ${
              msg.role === 'user' 
                ? 'bg-blue-600/90 text-white rounded-br-none border-blue-500 shadow-lg shadow-blue-900/20' 
                : 'bg-slate-900/80 text-slate-200 rounded-bl-none border-slate-700/50 shadow-xl'
            }`}>
              {msg.isThinking && (
                  <div className="mb-3 text-xs text-amber-400/80 flex items-center gap-2 font-mono bg-amber-900/20 p-2 rounded border border-amber-900/30">
                      <Brain size={12} className="animate-pulse" /> Analyzed Logic Path
                  </div>
              )}
              {msg.role === 'model' && (
                  <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Terminal size={10} /> GMW 11 CORE
                  </div>
              )}
              <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                 <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Grounding Sources */}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/30 grid gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Verified Data Sources</span>
                    <div className="flex flex-wrap gap-2">
                        {msg.groundingUrls.map((url, uIdx) => (
                            <a 
                                key={uIdx} 
                                href={url.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 px-2.5 py-1.5 rounded-md text-xs text-cyan-400 truncate max-w-full border border-slate-800 transition-all hover:border-cyan-500/30"
                            >
                                {url.source === 'maps' ? <MapPin size={10} /> : <Globe size={10} />}
                                {url.title || 'External Source'} <ExternalLink size={10} />
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#020617] border-t border-slate-800/50 z-20">
        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800 focus-within:border-cyan-500/50 transition-all shadow-lg">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter core directive..."
                className="flex-1 bg-transparent text-white px-3 py-2 outline-none placeholder:text-slate-600 font-medium"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input}
                className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
                <Send size={18} />
            </button>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-slate-600 font-mono">GMW 11 CORE // v4.0 DEC-2025</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
