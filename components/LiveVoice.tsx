
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Radio, Activity, StopCircle, Volume2, Waves } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MODELS, SYSTEM_INSTRUCTIONS } from '../constants';
import { createPcmBlob, decode, decodeAudioData } from '../services/audioUtils';

const LiveVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Neural Link Standby');
  const [transcriptions, setTranscriptions] = useState<{user: string, model: string}[]>([]);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentTurnRef = useRef({ user: '', model: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const stop = () => {
      inputAudioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      inputAudioContextRef.current = null;
      outputAudioContextRef.current = null;
      setIsActive(false);
      setStatus('Link Terminated');
      sessionPromiseRef.current = null;
  };

  const start = async () => {
    try {
        setStatus('Initializing Audio Protocols...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        
        const outputNode = outputAudioContextRef.current.createGain();
        outputNode.connect(outputAudioContextRef.current.destination);
        
        setStatus('Establishing Neural Uplink...');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
            model: MODELS.LIVE,
            callbacks: {
                onopen: () => {
                    setStatus('Neural Link Active. Listening...');
                    setIsActive(true);
                    
                    if (!inputAudioContextRef.current) return;
                    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createPcmBlob(inputData);
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (audioData && outputAudioContextRef.current) {
                        const ctx = outputAudioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        
                        const audioBuffer = await decodeAudioData(decode(audioData), ctx);
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => sourcesRef.current.delete(source));
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }
                    
                    if (msg.serverContent?.inputTranscription) {
                        currentTurnRef.current.user += msg.serverContent.inputTranscription.text;
                    }
                    if (msg.serverContent?.outputTranscription) {
                         currentTurnRef.current.model += msg.serverContent.outputTranscription.text;
                    }
                    
                    if (msg.serverContent?.turnComplete) {
                        setTranscriptions(prev => [...prev, { ...currentTurnRef.current }]);
                        currentTurnRef.current = { user: '', model: '' };
                    }
                    
                    if (msg.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => {
                    setStatus('Link Closed');
                    setIsActive(false);
                },
                onerror: (e) => {
                    console.error(e);
                    setStatus('Uplink Error');
                    setIsActive(false);
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                },
                systemInstruction: SYSTEM_INSTRUCTIONS.ARA,
                inputAudioTranscription: {},
                outputAudioTranscription: {}
            }
        });
        
        sessionPromiseRef.current = sessionPromise;

    } catch (e) {
        console.error(e);
        setStatus('Connection Failed');
        setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] p-8 items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        {isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[500px] h-[500px] bg-red-600/20 rounded-full animate-ping-slow blur-3xl"></div>
            </div>
        )}

        <div className="w-full max-w-2xl flex flex-col items-center gap-10 z-10">
            <div className={`relative w-40 h-40 flex items-center justify-center transition-all duration-700`}>
                <div className={`absolute inset-0 rounded-full border-2 ${isActive ? 'border-red-500 animate-spin-slow' : 'border-slate-800'}`}></div>
                <div className={`absolute inset-2 rounded-full border-2 ${isActive ? 'border-red-500/50 animate-reverse-spin' : 'border-slate-800'}`}></div>
                
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-red-500/10 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'bg-slate-900'
                }`}>
                    {isActive ? <Waves size={48} className="text-red-500 animate-pulse" /> : <MicOff size={48} className="text-slate-600" />}
                </div>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2 justify-center">
                    GMW 11 <span className="text-slate-500 font-light">|</span> NEURAL VOICE
                </h2>
                <div className="flex items-center gap-2 justify-center text-sm font-mono tracking-widest uppercase">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={isActive ? 'text-red-400' : 'text-slate-500'}>{status}</span>
                </div>
            </div>

            <button
                onClick={isActive ? stop : start}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                    isActive 
                    ? 'bg-slate-900 border border-red-500/50 text-red-500 hover:bg-red-950/30' 
                    : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl shadow-red-900/30'
                }`}
            >
                {isActive ? (
                    <>
                        <StopCircle size={24} /> TERMINATE UPLINK
                    </>
                ) : (
                    <>
                        <Mic size={24} /> INITIATE LINK
                    </>
                )}
            </button>

            {/* Transcript Area */}
            {transcriptions.length > 0 && (
                <div className="w-full mt-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 h-64 overflow-y-auto" ref={scrollRef}>
                    {transcriptions.map((t, i) => (
                        <div key={i} className="mb-6 space-y-2">
                            <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Operator</div>
                            <div className="text-slate-300 text-sm mb-3 pl-3 border-l-2 border-slate-700/50">{t.user}</div>
                            <div className="text-red-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                                <Activity size={10} /> GMW 11 Core
                            </div>
                            <div className="text-red-100 text-sm pl-3 border-l-2 border-red-900/50 leading-relaxed">{t.model}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default LiveVoice;
